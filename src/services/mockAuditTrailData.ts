export interface AuditLogEntry {
  id: string;
  timestamp: string;
  tenantId: string;
  agentId: string;
  modelId: string;
  caseId: string;
  action: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  status: 'SUCCESS' | 'ERROR' | 'HUMAN_OVERRIDE';
  details: {
    prompt: string;
    response: string;
    reasoningChain?: string;
  };
}

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'LOG-009182',
    timestamp: '2026-05-20T10:15:23Z',
    tenantId: 'TEN-001',
    agentId: 'Sanctions-Agent-v2',
    modelId: 'claude-3-5-sonnet',
    caseId: 'CAS-9912',
    action: 'Screen Entity',
    inputTokens: 1205,
    outputTokens: 342,
    latencyMs: 1250,
    status: 'SUCCESS',
    details: {
      prompt: `SYSTEM: You are an expert AML analyst. Screen the following entity against the OFAC sanctions list.
ENTITY_NAME: "Global Trade Corp Ltd"
JURISDICTION: "Cayman Islands"
ALIASES: ["GTC", "Global Trade Corp"]`,
      response: `{
  "matchFound": false,
  "confidenceScore": 0.98,
  "notes": "No direct matches found in OFAC SDN list for 'Global Trade Corp Ltd' or its aliases."
}`,
      reasoningChain: `1. Analyzed entity name and aliases.
2. Searched OFAC SDN database using fuzzy matching threshold 0.85.
3. Found 0 potential matches.
4. Concluded entity is clear.`
    }
  },
  {
    id: 'LOG-009181',
    timestamp: '2026-05-20T10:12:05Z',
    tenantId: 'TEN-001',
    agentId: 'SAR-Narrative-Agent',
    modelId: 'claude-3-5-sonnet',
    caseId: 'CAS-9911',
    action: 'Draft Narrative',
    inputTokens: 4500,
    outputTokens: 850,
    latencyMs: 4500,
    status: 'HUMAN_OVERRIDE',
    details: {
      prompt: `SYSTEM: Draft a SAR narrative based on the provided transaction history and KYC details...`,
      response: `The customer exhibited rapid movement of funds indicative of layering...`,
      reasoningChain: `1. Summarized KYC profile (High Risk).
2. Identified structuring pattern in April transactions.
3. Drafted introduction, body, and conclusion per FinCEN SAR formatting guidelines.`
    }
  },
  {
    id: 'LOG-009180',
    timestamp: '2026-05-20T09:45:12Z',
    tenantId: 'TEN-002',
    agentId: 'TransactionMonitor-v1',
    modelId: 'amazon-titan-text',
    caseId: 'CAS-9905',
    action: 'Classify Alert',
    inputTokens: 300,
    outputTokens: 5,
    latencyMs: 300,
    status: 'ERROR',
    details: {
      prompt: `Classify the risk level of this alert: [DATA]`,
      response: `Error: Bedrock ThrottlingException`,
    }
  },
  {
    id: 'LOG-009179',
    timestamp: '2026-05-20T08:30:00Z',
    tenantId: 'TEN-001',
    agentId: 'CDD-Agent-v3',
    modelId: 'claude-3-5-sonnet',
    caseId: 'CAS-9920',
    action: 'UBO Resolution',
    inputTokens: 2100,
    outputTokens: 150,
    latencyMs: 2200,
    status: 'SUCCESS',
    details: {
      prompt: `SYSTEM: Resolve the Ultimate Beneficial Owner from the provided corporate registry document...`,
      response: `{"ubo": "Sarah Jenkins", "ownershipPercentage": 45.5}`,
      reasoningChain: `1. Extracted shareholder table.
2. Traced ownership of parent company to Sarah Jenkins.
3. Calculated effective ownership (50% of 91% = 45.5%).`
    }
  }
];

export const fetchAuditLogs = async (): Promise<AuditLogEntry[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockAuditLogs;
};
