/**
 * AIIENS HEALTH — Development Seed Script
 *
 * ⚠️  FOR DEVELOPMENT USE ONLY — NEVER RUN IN PRODUCTION
 *
 * Seeds the database with realistic demo data labelled [DEMO] so it is
 * immediately identifiable. Running this script multiple times is safe —
 * it will drop existing demo collections and re-seed.
 *
 * Usage:
 *   npx tsx src/seeds/seed.ts
 *   # or
 *   npm run seed
 */

import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';

// ── Load env ──────────────────────────────────────────────────────────────────
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ── Import models ─────────────────────────────────────────────────────────────
import {
  User,
  Role,
  Donor,
  Hospital,
  PatientCase,
  Campaign,
  MedicalCamp,
  BloodRequest,
  AuditEvent,
  Notification,
  RiskFlag,
} from '../models';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_TAG = '[DEMO]';

function demoEmail(name: string): string {
  return `${name.toLowerCase().replace(/ /g, '.')}@demo.aiiens.health`;
}

function pastDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

function futureDate(daysFromNow: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed Functions
// ─────────────────────────────────────────────────────────────────────────────

async function seedRoles() {
  console.log('  → Seeding roles...');
  await Role.deleteMany({ description: { $regex: DEMO_TAG } });

  const roles = await Role.insertMany([
    {
      name: 'SUPER_ADMIN',
      displayName: 'Platform Administrator',
      description: `${DEMO_TAG} Full platform access with all permissions`,
      permissions: [
        'campaign:create', 'campaign:read', 'campaign:update', 'campaign:delete', 'campaign:approve',
        'case:create', 'case:read', 'case:update', 'case:approve', 'case:reject',
        'user:create', 'user:read', 'user:update', 'user:suspend',
        'settlement:approve', 'settlement:reject',
        'risk_flag:read', 'risk_flag:resolve',
        'audit:read', 'audit:export',
      ],
      isSystem: true,
    },
    {
      name: 'PUBLIC_USER',
      displayName: 'Platform User',
      description: `${DEMO_TAG} Standard user with basic access`,
      permissions: [
        'campaign:read', 'case:create', 'donation:create',
      ],
      isSystem: true,
    },
    {
      name: 'MEDICAL_REVIEWER',
      displayName: 'Content Moderator',
      description: `${DEMO_TAG} Reviews and moderates campaigns and complaints`,
      permissions: [
        'campaign:read', 'campaign:update', 'campaign:approve',
        'case:read', 'case:update',
        'complaint:read', 'complaint:update',
      ],
      isSystem: true,
    },
    {
      name: 'CASE_OFFICER',
      displayName: 'Field Officer',
      description: `${DEMO_TAG} Manages on-ground case verification and camp coordination`,
      permissions: [
        'case:read', 'case:update',
        'camp:create', 'camp:update',
        'blood_request:create', 'blood_request:update',
      ],
      isSystem: false,
    },
    {
      name: 'HOSPITAL_VERIFIER',
      displayName: 'NGO Partner',
      description: `${DEMO_TAG} NGO organization account with campaign and camp capabilities`,
      permissions: [
        'campaign:create', 'campaign:read', 'campaign:update',
        'camp:create', 'camp:update', 'camp:read',
      ],
      isSystem: false,
    },
  ]);

  console.log(`     ✓ ${roles.length} roles seeded`);
  return roles;
}

async function seedUsers() {
  console.log('  → Seeding users...');
  await User.deleteMany({ email: { $regex: '@demo.aiiens.health' } });

  const passwordHash = await bcrypt.hash('Demo@123456', 12);

  const users = await User.insertMany([
    {
      name: `${DEMO_TAG} Admin User`,
      email: demoEmail('admin'),
      phone: '+919876543210',
      passwordHash,
      roles: ['SUPER_ADMIN'],
      status: 'active',
      consentStatus: 'given',
      emailVerifiedAt: pastDate(30),
    },
    {
      name: `${DEMO_TAG} Priya Sharma`,
      email: demoEmail('priya sharma'),
      phone: '+919876543211',
      passwordHash,
      roles: ['PUBLIC_USER', 'DONOR'],
      status: 'active',
      consentStatus: 'given',
      emailVerifiedAt: pastDate(20),
    },
    {
      name: `${DEMO_TAG} Arjun Mehta`,
      email: demoEmail('arjun mehta'),
      phone: '+919876543212',
      passwordHash,
      roles: ['PUBLIC_USER', 'DONOR'],
      status: 'active',
      consentStatus: 'given',
      emailVerifiedAt: pastDate(15),
    },
    {
      name: `${DEMO_TAG} Sunita Rao`,
      email: demoEmail('sunita rao'),
      phone: '+919876543213',
      passwordHash,
      roles: ['PUBLIC_USER', 'PATIENT_GUARDIAN'],
      status: 'active',
      consentStatus: 'given',
      emailVerifiedAt: pastDate(10),
    },
    {
      name: `${DEMO_TAG} Field Officer`,
      email: demoEmail('field officer'),
      phone: '+919876543214',
      passwordHash,
      roles: ['CASE_OFFICER'],
      status: 'active',
      consentStatus: 'given',
      emailVerifiedAt: pastDate(25),
    },
    {
      name: `${DEMO_TAG} NGO Aarogya Foundation`,
      email: demoEmail('aarogya foundation'),
      phone: '+919876543215',
      passwordHash,
      roles: ['HOSPITAL_VERIFIER'],
      status: 'active',
      consentStatus: 'given',
      emailVerifiedAt: pastDate(40),
    },
    {
      name: `${DEMO_TAG} Moderator`,
      email: demoEmail('moderator'),
      phone: '+919876543216',
      passwordHash,
      roles: ['MEDICAL_REVIEWER'],
      status: 'active',
      consentStatus: 'given',
      emailVerifiedAt: pastDate(35),
    },
  ]);

  console.log(`     ✓ ${users.length} users seeded`);
  return users;
}

async function seedHospitals(adminUserId: Types.ObjectId) {
  console.log('  → Seeding hospitals...');
  await Hospital.deleteMany({ registrationNumber: { $regex: 'DEMO' } });

  const hospitals = await Hospital.insertMany([
    {
      name: `${DEMO_TAG} Apollo Multispeciality Hospital`,
      registrationNumber: 'DEMO-HOSP-001',
      type: 'private',
      address: {
        line1: '123, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        country: 'India',
        latitude: 17.4126,
        longitude: 78.4071,
      },
      contact: {
        phone: '+914023456789',
        email: 'contact@demo-apollo.aiiens.health',
        website: 'https://demo.apollohospitals.com',
        emergencyPhone: '+914023456790',
      },
      authorizedContacts: [
        {
          name: 'Dr. Ramesh Nair',
          designation: 'Medical Director',
          email: 'ramesh.nair@demo-apollo.aiiens.health',
          phone: '+919898989898',
        },
      ],
      verificationStatus: 'verified',
      verifiedBy: adminUserId,
      verifiedAt: pastDate(60),
      isActive: true,
      specializations: ['cardiac', 'oncology', 'orthopedic', 'neurology'],
      bedCount: 450,
    },
    {
      name: `${DEMO_TAG} Government District Hospital`,
      registrationNumber: 'DEMO-HOSP-002',
      type: 'government',
      address: {
        line1: '45, Civil Lines',
        city: 'Nagpur',
        state: 'Maharashtra',
        pincode: '440001',
        country: 'India',
        latitude: 21.1458,
        longitude: 79.0882,
      },
      contact: {
        phone: '+917123456789',
        email: 'contact@demo-govt.aiiens.health',
        emergencyPhone: '+917123456790',
      },
      authorizedContacts: [
        {
          name: 'Dr. Anjali Deshmukh',
          designation: 'Superintendent',
          email: 'anjali.d@demo-govt.aiiens.health',
          phone: '+919898989800',
        },
      ],
      verificationStatus: 'verified',
      verifiedBy: adminUserId,
      verifiedAt: pastDate(45),
      isActive: true,
      specializations: ['general_surgery', 'maternity', 'pediatrics'],
      bedCount: 300,
    },
  ]);

  console.log(`     ✓ ${hospitals.length} hospitals seeded`);
  return hospitals;
}

async function seedDonors(users: mongoose.Document[]) {
  console.log('  → Seeding donors...');
  await Donor.deleteMany({ donationCount: { $exists: true }, 'consent.consentVersion': '1.0' });

  const priyaUser = users[1] as { _id: Types.ObjectId };
  const arjunUser = users[2] as { _id: Types.ObjectId };

  const donors = await Donor.insertMany([
    {
      userId: priyaUser._id,
      bloodGroup: 'B+',
      dateOfBirth: new Date('1992-05-15'),
      gender: 'female',
      contact: {
        address: '12, Lake View Colony',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        emergencyContactName: 'Raj Sharma',
        emergencyContactPhone: '+919090909090',
      },
      eligibility: {
        isEligible: true,
        lastDonationDate: pastDate(90),
        lastEligibilityCheckDate: pastDate(90),
        disqualifyingConditions: [],
        notes: `${DEMO_TAG} Eligible — last donation 3 months ago`,
      },
      availability: 'available',
      consent: {
        dataProcessingConsented: true,
        consentedAt: pastDate(20),
        consentVersion: '1.0',
      },
      verificationStatus: 'verified',
      verifiedBy: users[0] as unknown as Types.ObjectId,
      verifiedAt: pastDate(15),
      donationCount: 3,
      lastDonatedAt: pastDate(90),
    },
    {
      userId: arjunUser._id,
      bloodGroup: 'O+',
      dateOfBirth: new Date('1988-11-22'),
      gender: 'male',
      contact: {
        address: '78, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
      },
      eligibility: {
        isEligible: false,
        lastDonationDate: pastDate(30),
        lastEligibilityCheckDate: pastDate(30),
        disqualifyingConditions: ['cooldown_period'],
        notes: `${DEMO_TAG} In cooldown — donated 30 days ago`,
      },
      availability: 'cooldown',
      consent: {
        dataProcessingConsented: true,
        consentedAt: pastDate(30),
        consentVersion: '1.0',
      },
      verificationStatus: 'verified',
      verifiedBy: users[0] as unknown as Types.ObjectId,
      verifiedAt: pastDate(28),
      donationCount: 7,
      lastDonatedAt: pastDate(30),
    },
  ]);

  console.log(`     ✓ ${donors.length} donors seeded`);
  return donors;
}

async function seedPatientCases(users: mongoose.Document[], hospitals: mongoose.Document[]) {
  console.log('  → Seeding patient cases...');
  await PatientCase.deleteMany({ diagnosisDescription: { $regex: DEMO_TAG } });

  const sunita = users[3] as { _id: Types.ObjectId };
  const priya = users[1] as { _id: Types.ObjectId };
  const officer = users[4] as { _id: Types.ObjectId };
  const hospital1 = hospitals[0] as { _id: Types.ObjectId };
  const hospital2 = hospitals[1] as { _id: Types.ObjectId };

  const cases = await PatientCase.insertMany([
    {
      guardianUserId: sunita._id,
      hospitalId: hospital1._id,
      diagnosisCategory: 'cardiac',
      diagnosisDescription: `${DEMO_TAG} Patient requires urgent open-heart surgery for triple vessel coronary artery disease. All conservative management options have been exhausted.`,
      treatmentPlan: {
        description: 'Coronary Artery Bypass Grafting (CABG) followed by 6 weeks cardiac rehabilitation',
        procedureName: 'CABG',
        estimatedDurationDays: 42,
        treatingDoctorName: 'Dr. Ramesh Nair',
        treatingDoctorRegistrationNumber: 'MCI-98765',
      },
      estimatedCost: 40000000,  // ₹4,00,000 in paisa
      currency: 'INR',
      costBreakdown: [
        { category: 'surgery', amount: 25000000, currency: 'INR' },
        { category: 'hospitalization', amount: 8000000, currency: 'INR' },
        { category: 'medications', amount: 4000000, currency: 'INR' },
        { category: 'physiotherapy', amount: 3000000, currency: 'INR' },
      ],
      fundraisingTarget: 40000000,
      urgency: 'high',
      status: 'APPROVED',
      assignedOfficerId: officer._id,
      approvedAt: pastDate(10),
    },
    {
      guardianUserId: priya._id,
      hospitalId: hospital2._id,
      diagnosisCategory: 'pediatrics',
      diagnosisDescription: `${DEMO_TAG} 4-year-old child with congenital cataract in both eyes requiring immediate surgical intervention to prevent permanent vision loss.`,
      treatmentPlan: {
        description: 'Bilateral cataract extraction with intraocular lens implantation',
        procedureName: 'Cataract Surgery',
        estimatedDurationDays: 14,
        treatingDoctorName: 'Dr. Anjali Deshmukh',
        treatingDoctorRegistrationNumber: 'MCI-54321',
      },
      estimatedCost: 8000000,  // ₹80,000 in paisa
      currency: 'INR',
      costBreakdown: [
        { category: 'surgery', amount: 5000000, currency: 'INR' },
        { category: 'hospitalization', amount: 2000000, currency: 'INR' },
        { category: 'medications', amount: 1000000, currency: 'INR' },
      ],
      fundraisingTarget: 8000000,
      urgency: 'critical',
      status: 'LIVE',
      assignedOfficerId: officer._id,
      approvedAt: pastDate(20),
    },
  ]);

  console.log(`     ✓ ${cases.length} patient cases seeded`);
  return cases;
}

async function seedCampaigns(cases: mongoose.Document[], users: mongoose.Document[]) {
  console.log('  → Seeding campaigns...');
  await Campaign.deleteMany({ slug: { $regex: 'demo-' } });

  const sunita = users[3] as { _id: Types.ObjectId };
  const priya = users[1] as { _id: Types.ObjectId };
  const admin = users[0] as { _id: Types.ObjectId };
  const case1 = cases[0] as { _id: Types.ObjectId };
  const case2 = cases[1] as { _id: Types.ObjectId };

  const campaigns = await Campaign.insertMany([
    {
      caseId: case1._id,
      createdBy: sunita._id,
      title: `${DEMO_TAG} Help Rajan Fight Heart Disease`,
      slug: 'demo-help-rajan-heart-disease',
      summary: `${DEMO_TAG} Rajan, a 52-year-old daily wage worker from Nagpur, needs urgent open-heart surgery. His family cannot afford the ₹4 lakh cost. Your donation can give him a second chance at life.`,
      story: `${DEMO_TAG} Rajan Kumar has been the sole breadwinner of his family for over 25 years. A mason by profession, he built homes for others while his own heart was silently failing. In January 2026, he collapsed at a construction site and was rushed to Apollo Hospital where doctors diagnosed him with triple vessel coronary artery disease. Without a bypass surgery in the next 30 days, the doctors give him very little hope of survival.\n\nHis wife Kamla and two daughters look up to him for everything. With no savings left and a daughter's wedding coming up, the family is in dire need. The estimated cost of surgery is ₹4 lakhs — an impossible sum for a daily-wage family.\n\nYour donation, however small, can save Rajan's life. Every rupee will be transparently tracked and settled directly to Apollo Hospital after surgery. Please give generously.`,
      goal: 40000000,  // ₹4,00,000 in paisa
      currency: 'INR',
      raisedAmount: 18500000,
      donorCount: 42,
      status: 'active',
      reviewedBy: admin._id,
      reviewedAt: pastDate(9),
      publishedAt: pastDate(9),
    },
    {
      caseId: case2._id,
      createdBy: priya._id,
      title: `${DEMO_TAG} Baby Aanya Needs Eye Surgery`,
      slug: 'demo-baby-aanya-eye-surgery',
      summary: `${DEMO_TAG} 4-year-old Aanya was born with congenital cataracts in both eyes. Without surgery in the next 2 weeks, she may lose her sight permanently. Help her see the world.`,
      story: `${DEMO_TAG} Aanya was born into a world she could barely see. Diagnosed with congenital cataracts in both eyes at birth, she has never seen her mother's smile clearly. Her parents, both daily-wage workers in Nagpur, learned that a surgical intervention before the age of 5 is the only window to restore functional vision.\n\nDr. Anjali Deshmukh at the Government District Hospital has agreed to operate at the lowest possible cost: ₹80,000. This includes the surgery, intraocular lenses, hospitalization, and post-operative medications.\n\nAanya's parents earn ₹8,000 a month combined. They have nothing left to give. But you can give Aanya the gift of sight. Please donate today.`,
      goal: 8000000,   // ₹80,000 in paisa
      currency: 'INR',
      raisedAmount: 7200000,
      donorCount: 89,
      status: 'active',
      reviewedBy: admin._id,
      reviewedAt: pastDate(18),
      publishedAt: pastDate(18),
      featuredUntil: futureDate(7),
    },
  ]);

  console.log(`     ✓ ${campaigns.length} campaigns seeded`);
  return campaigns;
}

async function seedMedicalCamps(users: mongoose.Document[], hospitals: mongoose.Document[]) {
  console.log('  → Seeding medical camps...');
  await MedicalCamp.deleteMany({ title: { $regex: DEMO_TAG } });

  const ngo = users[5] as { _id: Types.ObjectId };
  const hospital1 = hospitals[0] as { _id: Types.ObjectId };

  const camps = await MedicalCamp.insertMany([
    {
      title: `${DEMO_TAG} Free Health Camp — Hyderabad`,
      description: `${DEMO_TAG} A free community health camp offering general checkups, blood tests, BP/sugar screening, and eye checkups. Open to all residents of Banjara Hills and surrounding areas.`,
      hostUserId: ngo._id,
      hospitalId: hospital1._id,
      provider: {
        name: `${DEMO_TAG} Aarogya Foundation`,
        registrationNumber: 'DEMO-NGO-001',
        contactName: 'Mr. Suresh Babu',
        contactPhone: '+919876540001',
        contactEmail: 'suresh@demo-aarogya.aiiens.health',
      },
      location: {
        venue: 'Community Hall, Banjara Hills',
        address: '5th Road, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        latitude: 17.4126,
        longitude: 78.4071,
      },
      startDate: futureDate(7),
      endDate: futureDate(7),
      registrationDeadline: futureDate(5),
      timings: '09:00 AM – 04:00 PM',
      services: ['general_checkup', 'blood_test', 'bp_sugar_screening', 'eye_checkup'],
      capacity: 200,
      registeredCount: 67,
      attendedCount: 0,
      status: 'PUBLISHED',
    },
    {
      title: `${DEMO_TAG} Child Vaccination Drive — Nagpur`,
      description: `${DEMO_TAG} Free vaccination drive for children aged 0-5 years. Includes polio, measles, hepatitis, and other routine vaccines.`,
      hostUserId: ngo._id,
      provider: {
        name: `${DEMO_TAG} Aarogya Foundation`,
        registrationNumber: 'DEMO-NGO-001',
        contactName: 'Dr. Meena Kulkarni',
        contactPhone: '+919876540002',
        contactEmail: 'meena@demo-aarogya.aiiens.health',
      },
      location: {
        venue: 'Municipal School Ground',
        address: 'Gandhi Nagar, Civil Lines',
        city: 'Nagpur',
        state: 'Maharashtra',
        pincode: '440001',
        latitude: 21.1458,
        longitude: 79.0882,
      },
      startDate: pastDate(5),
      endDate: pastDate(5),
      timings: '08:00 AM – 02:00 PM',
      services: ['vaccination', 'pediatric_checkup'],
      capacity: 150,
      registeredCount: 143,
      attendedCount: 138,
      status: 'COMPLETED',
    },
  ]);

  console.log(`     ✓ ${camps.length} medical camps seeded`);
  return camps;
}

async function seedBloodRequests(hospitals: mongoose.Document[]) {
  console.log('  → Seeding blood requests...');
  await BloodRequest.deleteMany({ 'location.city': { $in: ['Hyderabad', 'Nagpur'] }, status: 'ACTIVE' });

  const hospital1 = hospitals[0] as { _id: Types.ObjectId };
  const hospital2 = hospitals[1] as { _id: Types.ObjectId };

  const bloodRequests = await BloodRequest.insertMany([
    {
      hospitalId: hospital1._id,
      bloodGroup: 'B+',
      units: 3,
      urgency: 'high',
      requiredBy: futureDate(2),
      location: {
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        hospitalName: `${DEMO_TAG} Apollo Multispeciality Hospital`,
      },
      contactName: 'Blood Bank Coordinator',
      contactPhone: '+914023456791',
      notes: `${DEMO_TAG} Required for cardiac surgery patient`,
      status: 'ACTIVE',
      fulfilledUnits: 0,
      expiresAt: futureDate(7),
    },
    {
      hospitalId: hospital2._id,
      bloodGroup: 'O+',
      units: 2,
      urgency: 'critical',
      requiredBy: futureDate(1),
      location: {
        city: 'Nagpur',
        state: 'Maharashtra',
        pincode: '440001',
        hospitalName: `${DEMO_TAG} Government District Hospital`,
      },
      contactName: 'Emergency Dept',
      contactPhone: '+917123456791',
      notes: `${DEMO_TAG} Emergency — accident case`,
      status: 'ACTIVE',
      fulfilledUnits: 0,
      expiresAt: futureDate(3),
    },
  ]);

  console.log(`     ✓ ${bloodRequests.length} blood requests seeded`);
  return bloodRequests;
}

async function seedAuditEvents(users: mongoose.Document[], campaigns: mongoose.Document[]) {
  console.log('  → Seeding audit events...');
  await AuditEvent.deleteMany({ changeSummary: { $regex: DEMO_TAG } });

  const admin = users[0] as { _id: Types.ObjectId };
  const campaign1 = campaigns[0] as { _id: Types.ObjectId };

  await AuditEvent.insertMany([
    {
      actorUserId: admin._id,
      actorRole: 'SUPER_ADMIN',
      action: 'CAMPAIGN_APPROVED',
      objectType: 'Campaign',
      objectId: campaign1._id,
      changeSummary: `${DEMO_TAG} Campaign status changed from 'pending_review' to 'active'`,
      source: 'admin_panel',
      requestId: 'demo-req-001',
      timestamp: pastDate(9),
    },
    {
      actorUserId: admin._id,
      actorRole: 'SUPER_ADMIN',
      action: 'CASE_CREATED',
      objectType: 'Hospital',
      changeSummary: `${DEMO_TAG} Hospital 'Apollo Multispeciality' registered and verified`,
      source: 'admin_panel',
      requestId: 'demo-req-002',
      timestamp: pastDate(60),
    },
    {
      actorUserId: null,
      actorRole: 'system',
      action: 'RISK_FLAG_CREATED',
      objectType: 'Donation',
      changeSummary: `${DEMO_TAG} Automated risk flag raised for unusual transaction pattern`,
      source: 'system',
      timestamp: pastDate(2),
    },
  ]);

  console.log('     ✓ 3 audit events seeded');
}

async function seedNotifications(users: mongoose.Document[]) {
  console.log('  → Seeding notifications...');
  await Notification.deleteMany({ title: { $regex: DEMO_TAG } });

  const sunita = users[3] as { _id: Types.ObjectId };
  const priya = users[1] as { _id: Types.ObjectId };

  await Notification.insertMany([
    {
      recipientUserId: sunita._id,
      type: 'campaign_update',
      channel: 'in_app',
      title: `${DEMO_TAG} Your campaign is live!`,
      body: 'Help Rajan Fight Heart Disease is now active and accepting donations.',
      actionUrl: '/campaigns/demo-help-rajan-heart-disease',
      status: 'delivered',
      sentAt: pastDate(9),
      deliveredAt: pastDate(9),
      idempotencyKey: 'campaign:demo-campaign-1:published',
    },
    {
      recipientUserId: priya._id,
      type: 'donation_received',
      channel: 'in_app',
      title: `${DEMO_TAG} New donation received!`,
      body: 'Your campaign received ₹500 from an anonymous donor.',
      actionUrl: '/campaigns/demo-baby-aanya-eye-surgery',
      status: 'read',
      sentAt: pastDate(5),
      deliveredAt: pastDate(5),
      readAt: pastDate(4),
      idempotencyKey: 'donation:demo-donation-1:completed',
    },
  ]);

  console.log('     ✓ 2 notifications seeded');
}

async function seedRiskFlags(users: mongoose.Document[], campaigns: mongoose.Document[]) {
  console.log('  → Seeding risk flags...');
  await RiskFlag.deleteMany({ 'evidence.label': { $regex: DEMO_TAG } });

  const admin = users[0] as { _id: Types.ObjectId };
  const campaign1 = campaigns[0] as { _id: Types.ObjectId };

  await RiskFlag.insertMany([
    {
      relatedObjectType: 'Campaign',
      relatedObjectId: campaign1._id,
      riskType: 'unusual_transaction',
      severity: 'medium',
      status: 'investigating',
      source: 'system',
      evidence: [
        { type: 'text', value: '3 donations from same IP within 60 seconds', label: `${DEMO_TAG} Automated detection` },
      ],
      assignedReviewerUserId: admin._id,
      reviewStartedAt: pastDate(1),
    },
  ]);

  console.log('     ✓ 1 risk flag seeded');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/aiiens-health';

  console.log('\n🌱 AIIENS HEALTH — Development Seed Script');
  console.log('━'.repeat(50));
  console.log(`⚠️  FOR DEVELOPMENT USE ONLY`);
  console.log(`   Database: ${uri}`);
  console.log('━'.repeat(50));

  if (process.env.NODE_ENV === 'production') {
    console.error('\n❌ ABORTING: Seed script cannot run in production!\n');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('\n✅ MongoDB connected\n');

  try {
    const roles = await seedRoles();
    const users = await seedUsers();
    const hospitals = await seedHospitals(users[0]._id as Types.ObjectId);
    const donors = await seedDonors(users);
    const cases = await seedPatientCases(users, hospitals);
    const campaigns = await seedCampaigns(cases, users);
    await seedMedicalCamps(users, hospitals);
    await seedBloodRequests(hospitals);
    await seedAuditEvents(users, campaigns);
    await seedNotifications(users);
    await seedRiskFlags(users, campaigns);

    // Suppress unused var warning
    void roles;
    void donors;

    console.log('\n━'.repeat(50));
    console.log('✅ Seed complete!\n');
    console.log('Demo credentials (all passwords: Demo@123456):');
    console.log('  admin@demo.aiiens.health            → Admin');
    console.log('  priya.sharma@demo.aiiens.health     → User / Donor');
    console.log('  arjun.mehta@demo.aiiens.health      → User / Donor');
    console.log('  sunita.rao@demo.aiiens.health        → User / Guardian');
    console.log('  field.officer@demo.aiiens.health    → Field Officer');
    console.log('  aarogya.foundation@demo.aiiens.health → NGO');
    console.log('  moderator@demo.aiiens.health         → Moderator');
    console.log('━'.repeat(50) + '\n');
  } catch (err) {
    console.error('\n❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

void seed();
