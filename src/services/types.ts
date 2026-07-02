// ========================================================================
// API Type Definitions
// Maps to backend Pydantic models & DB schemas
// ========================================================================

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'new' | 'investigating' | 'resolved' | 'escalated' | 'false_positive';

export interface Alert {
  id: string;
  tenant_id: string;
  customer_id: string | null;
  alert_type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlertDetail extends Alert {
  details: AlertDetails | null;
}

export interface AlertDetails {
  triage?: TriageResult;
  agent_conclusion?: AgentConclusion;
  observations?: Observation[];
  [key: string]: unknown;
}

export interface TriageResult {
  decision: 'INVESTIGATE' | 'AUTO_CLEAR';
  rationale: string;
  confidence: number;
  matched_typologies: string[];
}

export interface AgentConclusion {
  narrative?: string;
  risk_level?: string;
  recommendation?: string;
  [key: string]: unknown;
}

export interface Observation {
  step_type?: 'Observe' | 'Think' | 'Plan' | 'Act' | 'Reflect';
  content?: string;
  tool_name?: string;
  tool_result?: string;
  agent?: string;
  [key: string]: unknown;
}

export interface AlertListResponse {
  alerts: Alert[];
  total: number;
}

export interface InvestigationResult {
  status: string;
  alert_id: string;
  tenant_id: string;
  final_alert_status: string;
  conclusion: AgentConclusion;
  observations: Observation[];
}
