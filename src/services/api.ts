// ========================================================================
// API Client — Real backend API calls with mock fallback
// Set VITE_USE_MOCK_DATA=true in .env to use mock data
// ========================================================================

import type {
  Alert,
  AlertDetail,
  AlertListResponse,
  InvestigationResult,
} from './types';
import type { AuditLogEntry } from './mockAuditTrailData';
import type { KYCCustomer } from './mockKYCData';
import type { SMRDraftPayload } from './mockSMRData';
import type { CorporateStructurePayload } from './mockCorporateData';

const BASE_URL = '';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ---------- Helpers ----------

function getStoredToken(): string | null {
  return localStorage.getItem('aml_access_token');
}

function getStoredTenantId(): string {
  try {
    const user = localStorage.getItem('aml_user');
    if (user) {
      return JSON.parse(user).tenant_id || 'default';
    }
  } catch {
    // ignore
  }
  return 'default';
}

class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-ID': getStoredTenantId(),
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('aml_access_token');
    localStorage.removeItem('aml_refresh_token');
    localStorage.removeItem('aml_user');
    window.location.href = '/login';
    throw new ApiError(401, 'Session expired');
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch { /* ignore */ }
    throw new ApiError(response.status, detail);
  }

  return response.json() as Promise<T>;
}

// ---------- Alerts (already real) ----------

export async function fetchAlerts(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<AlertListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());
  const query = searchParams.toString();
  return request<AlertListResponse>(`/api/v1/alerts${query ? `?${query}` : ''}`);
}

export async function fetchAlert(alertId: string): Promise<AlertDetail> {
  return request<AlertDetail>(`/api/v1/alerts/${alertId}`);
}

export async function investigateAlert(alertId: string): Promise<InvestigationResult> {
  return request<InvestigationResult>(`/api/v1/agents/alerts/${alertId}/investigate`, { method: 'POST' });
}

// ---------- Auth ----------

export interface AuthUser {
  user_id: string;
  email: string;
  full_name: string;
  roles: string[];
  tenant_id: string;
  is_active?: boolean;
}

export async function fetchUsers(): Promise<{ users: AuthUser[]; count: number }> {
  return request('/api/v1/auth/users');
}

export async function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
  roles: string[];
}): Promise<AuthUser> {
  return request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

// ---------- Audit Trail (Governance Logs) ----------

export async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  if (USE_MOCK) {
    const { fetchAuditLogs: mockFn } = await import('./mockAuditTrailData');
    return mockFn();
  }
  const data = await request<{ logs: any[]; count: number }>('/api/v1/governance/logs');
  return data.logs.map(log => ({
    id: log.id,
    timestamp: log.timestamp,
    tenantId: log.tenant_id,
    agentId: log.agent_id || '',
    modelId: log.model_id || '',
    caseId: log.case_id || '',
    action: log.event_type,
    inputTokens: log.input_tokens || 0,
    outputTokens: log.output_tokens || 0,
    latencyMs: log.latency_ms || 0,
    status: log.status || 'SUCCESS',
    details: {
      prompt: log.details?.input_summary || '',
      response: log.details?.output_summary || '',
      reasoningChain: log.details?.reasoning_chain,
    },
  }));
}

// ---------- KYC ----------

export async function fetchKYCCustomers(): Promise<KYCCustomer[]> {
  if (USE_MOCK) {
    const { fetchMockKYCCustomers } = await import('./mockKYCData');
    return fetchMockKYCCustomers();
  }
  const data = await request<{ customers: any[]; count: number }>('/api/v1/kyc/customers');
  return data.customers.map(c => ({
    id: c.id,
    name: c.name,
    entityType: c.entityType === 'individual' ? 'Individual' : c.entityType === 'entity' ? 'Corporate' : 'Trust',
    tranche: c.tranche || 'Tranche 2',
    industry: c.industry || 'General',
    jurisdiction: c.jurisdiction || 'AU',
    onboardingStage: mapOnboardingStage(c.onboardingStage),
    onboardingProgress: c.onboardingProgress || 0,
    identityVerification: c.onboardingProgress >= 20 ? 'VERIFIED' : 'PENDING',
    pepScreening: c.onboardingProgress >= 40 ? 'VERIFIED' : 'PENDING',
    sanctionsScreening: c.onboardingProgress >= 60 ? 'VERIFIED' : 'PENDING',
    adverseMedia: c.onboardingProgress >= 70 ? 'VERIFIED' : 'PENDING',
    overallRiskLevel: (c.overallRiskLevel || 'LOW') as any,
    overallRiskScore: c.overallRiskScore || 0,
    riskBreakdown: [],
    cddChecklist: [],
    createdAt: c.createdAt || new Date().toISOString(),
    lastUpdatedAt: c.lastUpdatedAt || new Date().toISOString(),
  }));
}

function mapOnboardingStage(stage: string): any {
  const map: Record<string, string> = {
    'PENDING': 'IDENTITY',
    'ID_VERIFICATION': 'IDENTITY',
    'PEP_SCREENING': 'SCREENING',
    'SANCTIONS_CHECK': 'SCREENING',
    'ADVERSE_MEDIA': 'SCREENING',
    'RISK_SCORING': 'RISK_ASSESSMENT',
    'COMPLETE': 'COMPLETE',
  };
  return map[stage] || 'IDENTITY';
}

export async function fetchKYCCustomer(customerId: string): Promise<KYCCustomer | null> {
  if (USE_MOCK) {
    const { fetchMockKYCCustomer } = await import('./mockKYCData');
    return fetchMockKYCCustomer(customerId);
  }
  const data = await request<{ customer_id: string; records: any[]; latest: any }>(`/api/v1/kyc/customers/${customerId}`);
  if (!data.latest) return null;
  const r = data.latest;
  return {
    id: customerId,
    name: customerId,
    entityType: 'Individual',
    tranche: 'Tranche 2',
    industry: 'General',
    jurisdiction: 'AU',
    onboardingStage: mapOnboardingStage(r.onboarding_stage),
    onboardingProgress: r.onboarding_stage === 'COMPLETE' ? 100 : 50,
    identityVerification: r.id_verification?.verified ? 'VERIFIED' : 'PENDING',
    pepScreening: r.pep_result ? 'VERIFIED' : 'PENDING',
    sanctionsScreening: r.sanctions_result ? 'VERIFIED' : 'PENDING',
    adverseMedia: r.adverse_media_result ? 'VERIFIED' : 'PENDING',
    overallRiskLevel: (r.risk_assessment?.risk_level || 'LOW').toUpperCase() as any,
    overallRiskScore: r.overall_risk_score || 0,
    riskBreakdown: (r.risk_assessment?.factors || []).map((f: any) => ({
      category: f.factor,
      score: f.score,
      weight: f.weight,
      signals: [f.explanation],
    })),
    cddChecklist: buildChecklist(r),
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };
}

function buildChecklist(r: any): any[] {
  const checks = [
    { id: 'id-verify', label: 'Identity Verification', category: 'identity' as const, done: !!r.id_verification },
    { id: 'pep', label: 'PEP Screening', category: 'screening' as const, done: !!r.pep_result },
    { id: 'sanctions', label: 'Sanctions Check', category: 'screening' as const, done: !!r.sanctions_result },
    { id: 'media', label: 'Adverse Media', category: 'screening' as const, done: !!r.adverse_media_result },
    { id: 'risk', label: 'Risk Assessment', category: 'risk' as const, done: !!r.risk_assessment },
  ];
  return checks.map(c => ({
    id: c.id,
    label: c.label,
    category: c.category,
    status: c.done ? 'COMPLETE' : 'PENDING',
  }));
}

// ---------- SMR / Reports ----------

export async function fetchSMRDraft(caseId: string): Promise<SMRDraftPayload> {
  if (USE_MOCK) {
    const { fetchMockSMRDraft } = await import('./mockSMRData');
    return fetchMockSMRDraft(caseId);
  }
  const draft = await request<any>(`/api/v1/cases/${caseId}/reports/draft`, {
    method: 'POST',
    body: JSON.stringify({ report_type: 'AUSTRAC_SMR' }),
  });
  return {
    reportId: draft.report_id,
    caseId,
    status: 'DRAFT',
    evidenceContext: {
      transactions: [],
      kycAlerts: [],
    },
    narrativeDraft: {
      suspicionBasis: draft.narrative?.['Reason for Suspicion'] || draft.narrative?.['Suspicious Activity Description'] || '',
      transactionDetails: draft.narrative?.['Transaction Details'] || '',
      customerProfile: draft.narrative?.['Subject Details'] || '',
    },
  };
}

export async function submitReport(reportId: string): Promise<any> {
  return request(`/api/v1/reports/${reportId}/submit`, { method: 'POST' });
}

// ---------- Corporate Structure ----------

export async function fetchCorporateStructure(entityId: string): Promise<CorporateStructurePayload> {
  if (USE_MOCK) {
    const { fetchMockCorporateStructure } = await import('./mockCorporateData');
    return fetchMockCorporateStructure(entityId);
  }
  const graph = await request<any>(`/api/v1/entities/${entityId}/ownership`);
  const uboIds = new Set((graph.ubos || []).map((u: any) => u.entity_id));
  const entities: CorporateStructurePayload['entities'] = Object.values(graph.entities || {}).map((e: any) => ({
    id: e.entity_id,
    name: e.name,
    type: (e.entity_type === 'company' ? 'Company' : e.entity_type === 'individual' ? 'Individual' : 'Trust') as any,
    jurisdiction: e.jurisdiction || 'AU',
    riskLevel: (e.risk_flags?.length > 0 ? 'high' : 'low') as any,
    isUBO: uboIds.has(e.entity_id),
    flags: e.risk_flags || [],
  }));
  const relationships: CorporateStructurePayload['relationships'] = (graph.edges || []).map((edge: any, i: number) => ({
    id: `edge-${i}`,
    sourceId: edge.source_id,
    targetId: edge.target_id,
    type: 'OWNS' as const,
    percentage: edge.ownership_percentage,
  }));
  return { entities, relationships };
}

// ---------- Responsible AI (mock fallback) ----------

export async function fetchResponsibleAIData(): Promise<any> {
  const { fetchResponsibleAIData: mockFn } = await import('./mockResponsibleAIData');
  return mockFn();
}

// ---------- Observability (mock fallback) ----------

export async function fetchObservabilityData(): Promise<any> {
  const { fetchObservabilityData: mockFn } = await import('./mockObservabilityData');
  return mockFn();
}

// ---------- Re-exports ----------

export type { Alert, AlertDetail, AlertListResponse, InvestigationResult };
export { ApiError };
