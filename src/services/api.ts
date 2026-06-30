// ========================================================================
// API Client
// Typed fetch functions for the AML backend with JWT authentication
// ========================================================================

import type {
  Alert,
  AlertDetail,
  AlertListResponse,
  InvestigationResult,
} from './types';

const BASE_URL = '';

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

  const response = await fetch(url, {
    ...options,
    headers,
  });

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
    } catch {
      // Response body isn't JSON — use status text
    }
    throw new ApiError(response.status, detail);
  }

  return response.json() as Promise<T>;
}

// ---------- Alerts ----------

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
  const path = `/api/v1/alerts${query ? `?${query}` : ''}`;

  return request<AlertListResponse>(path);
}

export async function fetchAlert(alertId: string): Promise<AlertDetail> {
  return request<AlertDetail>(`/api/v1/alerts/${alertId}`);
}

// ---------- Investigation ----------

export async function investigateAlert(alertId: string): Promise<InvestigationResult> {
  return request<InvestigationResult>(
    `/api/v1/agents/alerts/${alertId}/investigate`,
    { method: 'POST' },
  );
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
  return request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---------- Re-export types for convenience ----------

export type { Alert, AlertDetail, AlertListResponse, InvestigationResult };
export { ApiError };
