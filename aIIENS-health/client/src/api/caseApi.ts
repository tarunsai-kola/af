import axiosInstance from './axiosInstance';

export interface TreatmentPlan {
  description: string;
  procedureName: string;
  estimatedDurationDays?: number;
  treatingDoctorName?: string;
  treatingDoctorRegistrationNumber?: string;
}

export interface CostBreakdown {
  category: string;
  amount: number;
  currency: string;
}

export interface VerificationGate {
  gate: string;
  status: 'PENDING' | 'PASSED' | 'FAILED' | 'SKIPPED';
  notes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  reviewerId?: string;
  completedAt?: string;
}

export interface PatientCase {
  _id: string;
  patientUserId?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  patientRelation?: string;
  guardianUserId: string;
  hospitalId?: string;
  diagnosisCategory?: string;
  diagnosisDescription?: string;
  treatmentPlan?: TreatmentPlan;
  estimatedCost?: number;
  currency: string;
  costBreakdown: CostBreakdown[];
  fundraisingTarget?: number;
  urgency?: string;
  status: string;
  verificationGates?: VerificationGate[];
  documents?: any[];
  createdAt: string;
  updatedAt: string;
}

export const caseApi = {
  getMyCases: async () => {
    const res = await axiosInstance.get('/cases');
    return res.data;
  },
  createDraft: async (): Promise<{ id: string }> => {
    const { data } = await axiosInstance.post('/cases');
    return data.data;
  },
  getCase: async (id: string): Promise<PatientCase> => {
    const { data } = await axiosInstance.get(`/cases/${id}`);
    return data.data;
  },
  updateCase: async (id: string, updateData: Partial<PatientCase>): Promise<PatientCase> => {
    const { data } = await axiosInstance.patch(`/cases/${id}`, updateData);
    return data.data;
  },
  uploadDocument: async (id: string, file: File, documentType: string): Promise<any> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    
    const { data } = await axiosInstance.post(`/cases/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },
  submitCase: async (id: string): Promise<PatientCase> => {
    const { data } = await axiosInstance.post(`/cases/${id}/submit`);
    return data.data;
  }
};
