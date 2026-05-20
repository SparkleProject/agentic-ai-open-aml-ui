// ========================================================================
// Mock KYC/CDD Data Service
// Simulates BE-302 (KYC/CDD Automation Pipeline) responses
// ========================================================================

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'FAILED' | 'NOT_STARTED';
export type OnboardingStage = 'IDENTITY' | 'SCREENING' | 'RISK_ASSESSMENT' | 'APPROVAL' | 'COMPLETE';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CDDChecklistItem {
  id: string;
  label: string;
  category: 'identity' | 'screening' | 'risk' | 'documentation';
  status: 'COMPLETE' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
  completedAt?: string;
  automatedBy?: string;
  notes?: string;
}

export interface RiskScoreBreakdown {
  category: string;
  score: number;     // 0–100
  weight: number;    // 0–1
  signals: string[];
}

export interface KYCCustomer {
  id: string;
  name: string;
  entityType: 'Individual' | 'Corporate' | 'Trust';
  tranche: 'Tranche 1' | 'Tranche 2';
  industry: string;
  jurisdiction: string;
  onboardingStage: OnboardingStage;
  onboardingProgress: number; // 0–100
  identityVerification: VerificationStatus;
  pepScreening: VerificationStatus;
  sanctionsScreening: VerificationStatus;
  adverseMedia: VerificationStatus;
  overallRiskLevel: RiskLevel;
  overallRiskScore: number;  // 0–100
  riskBreakdown: RiskScoreBreakdown[];
  cddChecklist: CDDChecklistItem[];
  createdAt: string;
  lastUpdatedAt: string;
}

// ========================================================================
// Mock Customers
// ========================================================================

const mockCustomers: KYCCustomer[] = [
  {
    id: 'CUS-0012',
    name: 'Apex Real Estate Holdings Ltd',
    entityType: 'Corporate',
    tranche: 'Tranche 2',
    industry: 'Real Estate',
    jurisdiction: 'AU',
    onboardingStage: 'SCREENING',
    onboardingProgress: 45,
    identityVerification: 'VERIFIED',
    pepScreening: 'PENDING',
    sanctionsScreening: 'PENDING',
    adverseMedia: 'NOT_STARTED',
    overallRiskLevel: 'HIGH',
    overallRiskScore: 74,
    riskBreakdown: [
      { category: 'Jurisdiction Risk', score: 42, weight: 0.25, signals: ['High-risk jurisdiction involved', 'Cross-border transactions detected'] },
      { category: 'Entity Structure', score: 88, weight: 0.3, signals: ['Complex multi-layered ownership', 'Shell company indicators', 'UBO obfuscation'] },
      { category: 'Transaction Patterns', score: 65, weight: 0.25, signals: ['Structuring behaviour detected', 'Velocity anomaly'] },
      { category: 'Customer Profile', score: 71, weight: 0.2, signals: ['Tranche 2 entity — new to AML regime', 'Limited operating history'] },
    ],
    cddChecklist: [
      { id: 'cdd-1', label: 'Government ID Verification', category: 'identity', status: 'COMPLETE', completedAt: '2026-05-12T09:30:00Z', automatedBy: 'ID Verification Agent' },
      { id: 'cdd-2', label: 'Company Registration (ASIC)', category: 'identity', status: 'COMPLETE', completedAt: '2026-05-12T09:31:00Z', automatedBy: 'ASIC Lookup Tool' },
      { id: 'cdd-3', label: 'Beneficial Ownership Resolution', category: 'identity', status: 'IN_PROGRESS', automatedBy: 'Entity Unwrapping Agent' },
      { id: 'cdd-4', label: 'PEP Screening', category: 'screening', status: 'PENDING' },
      { id: 'cdd-5', label: 'Sanctions List Check', category: 'screening', status: 'PENDING' },
      { id: 'cdd-6', label: 'Adverse Media Scan', category: 'screening', status: 'PENDING' },
      { id: 'cdd-7', label: 'Source of Funds Verification', category: 'documentation', status: 'PENDING' },
      { id: 'cdd-8', label: 'Risk Assessment Finalisation', category: 'risk', status: 'PENDING' },
      { id: 'cdd-9', label: 'MLRO Approval', category: 'risk', status: 'PENDING' },
    ],
    createdAt: '2026-05-12T09:00:00Z',
    lastUpdatedAt: '2026-05-18T14:22:00Z',
  },
  {
    id: 'CUS-0013',
    name: 'Sarah Jenkins',
    entityType: 'Individual',
    tranche: 'Tranche 1',
    industry: 'Financial Services',
    jurisdiction: 'NZ',
    onboardingStage: 'COMPLETE',
    onboardingProgress: 100,
    identityVerification: 'VERIFIED',
    pepScreening: 'VERIFIED',
    sanctionsScreening: 'VERIFIED',
    adverseMedia: 'VERIFIED',
    overallRiskLevel: 'LOW',
    overallRiskScore: 18,
    riskBreakdown: [
      { category: 'Jurisdiction Risk', score: 10, weight: 0.25, signals: ['Domestic-only activity'] },
      { category: 'Entity Structure', score: 5, weight: 0.3, signals: ['Individual — straightforward'] },
      { category: 'Transaction Patterns', score: 22, weight: 0.25, signals: ['Minor velocity spike in March'] },
      { category: 'Customer Profile', score: 30, weight: 0.2, signals: ['Established customer since 2021'] },
    ],
    cddChecklist: [
      { id: 'cdd-1', label: 'Government ID Verification', category: 'identity', status: 'COMPLETE', completedAt: '2026-02-15T10:00:00Z', automatedBy: 'ID Verification Agent' },
      { id: 'cdd-2', label: 'PEP Screening', category: 'screening', status: 'COMPLETE', completedAt: '2026-02-15T10:01:00Z', automatedBy: 'PEP Screening Agent' },
      { id: 'cdd-3', label: 'Sanctions List Check', category: 'screening', status: 'COMPLETE', completedAt: '2026-02-15T10:01:30Z', automatedBy: 'Sanctions Agent' },
      { id: 'cdd-4', label: 'Adverse Media Scan', category: 'screening', status: 'COMPLETE', completedAt: '2026-02-15T10:02:00Z', automatedBy: 'Adverse Media Agent' },
      { id: 'cdd-5', label: 'Risk Assessment Finalisation', category: 'risk', status: 'COMPLETE', completedAt: '2026-02-15T10:05:00Z', automatedBy: 'CDD Agent' },
      { id: 'cdd-6', label: 'MLRO Approval', category: 'risk', status: 'COMPLETE', completedAt: '2026-02-16T08:30:00Z', notes: 'Approved by J. Carter (MLRO)' },
    ],
    createdAt: '2026-02-15T09:00:00Z',
    lastUpdatedAt: '2026-04-20T11:00:00Z',
  },
  {
    id: 'CUS-0014',
    name: 'Pacific Trust & Advisory',
    entityType: 'Trust',
    tranche: 'Tranche 2',
    industry: 'Legal Services',
    jurisdiction: 'AU',
    onboardingStage: 'RISK_ASSESSMENT',
    onboardingProgress: 70,
    identityVerification: 'VERIFIED',
    pepScreening: 'VERIFIED',
    sanctionsScreening: 'VERIFIED',
    adverseMedia: 'FAILED',
    overallRiskLevel: 'CRITICAL',
    overallRiskScore: 91,
    riskBreakdown: [
      { category: 'Jurisdiction Risk', score: 78, weight: 0.25, signals: ['Clients include high-risk jurisdictions (Vanuatu, Samoa)'] },
      { category: 'Entity Structure', score: 95, weight: 0.3, signals: ['Trust structure with nested sub-trusts', 'Nominee directors detected', 'UBO resolution failed'] },
      { category: 'Transaction Patterns', score: 82, weight: 0.25, signals: ['Round-tripping patterns detected', 'Layering behaviour suspected'] },
      { category: 'Customer Profile', score: 100, weight: 0.2, signals: ['Adverse media hit: director linked to money laundering investigation', 'Tranche 2 entity with no compliance history'] },
    ],
    cddChecklist: [
      { id: 'cdd-1', label: 'Trust Deed Verification', category: 'identity', status: 'COMPLETE', completedAt: '2026-04-20T13:00:00Z', automatedBy: 'Document Verification Agent' },
      { id: 'cdd-2', label: 'Trustee ID Verification', category: 'identity', status: 'COMPLETE', completedAt: '2026-04-20T13:05:00Z', automatedBy: 'ID Verification Agent' },
      { id: 'cdd-3', label: 'Beneficial Ownership Resolution', category: 'identity', status: 'FAILED', notes: 'Multi-layered trust structure; UBO chain exceeds 4 levels. Manual review required.' },
      { id: 'cdd-4', label: 'PEP Screening', category: 'screening', status: 'COMPLETE', completedAt: '2026-04-20T13:10:00Z', automatedBy: 'PEP Screening Agent' },
      { id: 'cdd-5', label: 'Sanctions List Check', category: 'screening', status: 'COMPLETE', completedAt: '2026-04-20T13:10:30Z', automatedBy: 'Sanctions Agent' },
      { id: 'cdd-6', label: 'Adverse Media Scan', category: 'screening', status: 'FAILED', notes: 'Director A. Patel linked to 2024 AFP investigation into trade-based ML.' },
      { id: 'cdd-7', label: 'Source of Wealth Verification', category: 'documentation', status: 'IN_PROGRESS' },
      { id: 'cdd-8', label: 'Enhanced Due Diligence Report', category: 'risk', status: 'PENDING' },
      { id: 'cdd-9', label: 'MLRO Approval', category: 'risk', status: 'PENDING' },
    ],
    createdAt: '2026-04-20T12:00:00Z',
    lastUpdatedAt: '2026-05-19T16:45:00Z',
  },
  {
    id: 'CUS-0015',
    name: 'Martin & Associates Law Firm',
    entityType: 'Corporate',
    tranche: 'Tranche 2',
    industry: 'Legal Services',
    jurisdiction: 'NZ',
    onboardingStage: 'IDENTITY',
    onboardingProgress: 15,
    identityVerification: 'PENDING',
    pepScreening: 'NOT_STARTED',
    sanctionsScreening: 'NOT_STARTED',
    adverseMedia: 'NOT_STARTED',
    overallRiskLevel: 'MEDIUM',
    overallRiskScore: 50,
    riskBreakdown: [
      { category: 'Jurisdiction Risk', score: 20, weight: 0.25, signals: ['Domestic NZ operations'] },
      { category: 'Entity Structure', score: 45, weight: 0.3, signals: ['Partnership structure — awaiting partner list'] },
      { category: 'Transaction Patterns', score: 0, weight: 0.25, signals: ['No transaction data yet'] },
      { category: 'Customer Profile', score: 100, weight: 0.2, signals: ['Tranche 2 legal entity — first-time reporting entity'] },
    ],
    cddChecklist: [
      { id: 'cdd-1', label: 'NZBN Company Verification', category: 'identity', status: 'IN_PROGRESS', automatedBy: 'NZBN Lookup Tool' },
      { id: 'cdd-2', label: 'Director ID Verification', category: 'identity', status: 'PENDING' },
      { id: 'cdd-3', label: 'Partner ID Verification', category: 'identity', status: 'PENDING' },
      { id: 'cdd-4', label: 'PEP Screening', category: 'screening', status: 'PENDING' },
      { id: 'cdd-5', label: 'Sanctions List Check', category: 'screening', status: 'PENDING' },
      { id: 'cdd-6', label: 'Adverse Media Scan', category: 'screening', status: 'PENDING' },
      { id: 'cdd-7', label: 'Risk Assessment', category: 'risk', status: 'PENDING' },
      { id: 'cdd-8', label: 'MLRO Approval', category: 'risk', status: 'PENDING' },
    ],
    createdAt: '2026-05-19T09:00:00Z',
    lastUpdatedAt: '2026-05-19T09:15:00Z',
  },
];

// ========================================================================
// Service Functions
// ========================================================================

export const fetchMockKYCCustomers = async (): Promise<KYCCustomer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockCustomers;
};

export const fetchMockKYCCustomer = async (customerId: string): Promise<KYCCustomer | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCustomers.find(c => c.id === customerId) ?? null;
};
