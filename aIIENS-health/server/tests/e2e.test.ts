import request from 'supertest';
import { createApp } from '../src/app';
import mongoose from 'mongoose';
import { User } from '../src/models/User.model';
import { Hospital } from '../src/models/Hospital.model';

const app = createApp();
let authCookie: string;
let adminCookie: string;
let caseId: string;
let hospitalId: string;
let campaignId: string;


describe('AIIENS Health End-to-End Workflow', () => {
  
  beforeAll(async () => {
    // Clear the db before tests
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
    }

    // 0. Seed Required Data (Hospitals, Admins)
    const hosp = await Hospital.create({
      name: 'Apollo Hospital',
      type: 'private',
      registrationNumber: 'REG12345',
      address: {
        line1: 'Main St',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      },
      contact: {
        email: 'contact@apollo.com',
        phone: '1234567890'
      },
      verificationStatus: 'verified',
      departments: ['Oncology']
    });
    hospitalId = hosp._id.toString();

    // Create an Admin user
    const bcrypt = require('bcryptjs');
    await User.create({
      name: 'Super Admin',
      email: 'admin@aiiens.org',
      passwordHash: await bcrypt.hash('Password123!', 10),
      roles: ['SUPER_ADMIN']
    });
  });

  // 1. Register & Login Patient Guardian
  it('Step 1-3: Register, Login, Become Donor', async () => {
    // Register
    const resReg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'Password123!' });
    expect(resReg.status).toBe(201);
    
    // Login
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'Password123!' });
    expect(resLogin.status).toBe(200);
    authCookie = resLogin.body.data.accessToken;

    // Become Donor
    const resDonor = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${authCookie}`)
      .send({
        bloodGroup: 'O+',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        contact: {
          address: '123 Street',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          emergencyContactPhone: '9876543210'
        },
        consent: {
          dataProcessingConsented: true,
          consentVersion: '1.0'
        }
      });
    if (resDonor.status !== 201) console.error('resDonor failed', resDonor.body);
    expect(resDonor.status).toBe(201);
  });

  // 4. Create Fundraiser Draft
  it('Step 4: Create Fundraiser Draft', async () => {
    const resDraft = await request(app)
      .post('/api/cases')
      .set('Authorization', `Bearer ${authCookie}`)
      .send();
    if (resDraft.status !== 201) console.error('resDraft failed', resDraft.body);
    expect(resDraft.status).toBe(201);
    caseId = resDraft.body.data.id;

    // Update draft with details
    const resUpdate = await request(app)
      .patch(`/api/cases/${caseId}`)
      .set('Authorization', `Bearer ${authCookie}`)
      .send({
        patientName: 'Jane Doe',
        patientAge: 10,
        patientGender: 'female',
        hospitalId: hospitalId,
        diagnosisCategory: 'oncology',
        diagnosisDescription: 'Leukemia',
        fundraisingTarget: 500000,
        currency: 'INR'
      });
    
    if (resUpdate.status !== 200) console.error('resUpdate failed', resUpdate.body);
    expect(resUpdate.status).toBe(200);
  });

  // 6. Submit Case
  it('Step 6: Submit Case', async () => {
    // First, upload a mock document directly to DB to bypass multer for testing
    // or test the actual endpoint using supertest attaches
    // Actually, skipping file upload here and mocking the document count to allow submission
    const mongoose = require('mongoose');
    const user = await User.findOne({ email: 'john@example.com' });
    
    await mongoose.model('MedicalDocument').create({
      caseId: caseId,
      documentType: 'diagnosis_report',
      storageKey: 'mock-file.pdf',
      storageProvider: 'local',
      fileHash: 'mock-hash',
      mimeType: 'application/pdf',
      fileSizeBytes: 1024,
      originalFileName: 'mock.pdf',
      issuerName: 'Apollo Hospital',
      accessPolicy: 'case_team',
      uploadedBy: user!._id
    });

    const resSubmit = await request(app)
      .post(`/api/cases/${caseId}/submit`)
      .set('Authorization', `Bearer ${authCookie}`)
      .send();
    if (resSubmit.status !== 200) console.error('resSubmit failed', resSubmit.body);
    expect(resSubmit.status).toBe(200);
    expect(resSubmit.body.data.status).toBe('UNDER_VERIFICATION');
  });

  // 7-10. Admin Verification
  it('Step 7-10: Admin Verification & Campaign Live', async () => {
    // Register Admin
    await request(app).post('/api/auth/register').send({ name: 'Admin', email: 'admin@example.com', password: 'Password123!' });
    // Manually set role in DB
    await User.findOneAndUpdate({ email: 'admin@example.com' }, { $set: { roles: ['SUPER_ADMIN'] } });
    
    // Login Admin
    const resAdminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Password123!' });
    adminCookie = resAdminLogin.body.data.accessToken;

    // Complete all gates G1 to G8
    const gates = [
      'G1_IDENTITY', 'G2_HOSPITAL', 'G3_CLINICAL', 'G4_FINANCIAL_NEED',
      'G5_CONSENT', 'G6_INTEGRITY', 'G7_FINANCE', 'G8_PUBLICATION'
    ];

    for (const gate of gates) {
      const resGate = await request(app)
        .post(`/api/admin/cases/${caseId}/verify/${gate}`)
        .set('Authorization', `Bearer ${adminCookie}`)
        .send({ status: 'PASSED', notes: 'Looks good' });
      if (resGate.status !== 200) console.error('resGate failed:', gate, resGate.body);
      expect(resGate.status).toBe(200);
    }

    // Verify Campaign was created automatically (logic from admin.controller)
    const mongoose = require('mongoose');
    const campaign = await mongoose.model('Campaign').findOne({ caseId });
    expect(campaign).toBeDefined();
    expect(campaign.status).toBe('active');
    campaignId = campaign._id.toString();
  });

  // 11-12. Public Donation
  it('Step 11-12: Public views campaign & makes donation', async () => {
    // View Campaign
    const resView = await request(app).get(`/api/campaigns`);
    expect(resView.status).toBe(200);
    expect(resView.body.data.length).toBe(1);

    // Make Donation
    await request(app)
      .post('/api/donations')
      .send({
        campaignId,
        amount: 5000,
        currency: 'INR',
        donorName: 'Generous Donor',
        donorEmail: 'donor@example.com'
      });
  });
});
