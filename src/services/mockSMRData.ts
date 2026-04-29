export interface Transaction {
  id: string;
  amount: number;
  date: string;
  recipient: string;
  flagged: boolean;
}

export interface SMRDraftPayload {
  reportId: string;
  caseId: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'SUBMITTED';
  evidenceContext: {
    transactions: Transaction[];
    kycAlerts: Array<{ type: string; description: string }>;
  };
  narrativeDraft: {
    suspicionBasis: string;
    transactionDetails: string;
    customerProfile: string;
  };
}

export const fetchMockSMRDraft = async (caseId: string): Promise<SMRDraftPayload> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    reportId: `SMR-${Math.floor(Math.random() * 10000)}`,
    caseId,
    status: 'DRAFT',
    evidenceContext: {
      transactions: [
        { id: 'TXN-9021', amount: 8900.0, date: '2026-04-09 14:22', recipient: 'GTC Holdings', flagged: true },
        { id: 'TXN-9022', amount: 9500.0, date: '2026-04-09 15:01', recipient: 'GTC Holdings', flagged: true },
        { id: 'TXN-9023', amount: 200.0, date: '2026-04-10 09:12', recipient: 'Vendor SaaS', flagged: false },
        { id: 'TXN-9024', amount: 9900.0, date: '2026-04-10 11:45', recipient: 'GTC Holdings', flagged: true },
      ],
      kycAlerts: [
        { type: 'Corporate Structure', description: 'GTC Holdings shares UBO with a formally sanctioned entity.' },
        { type: 'Velocity', description: 'Transaction threshold of $10,000 bypassed via structuring.' }
      ]
    },
    narrativeDraft: {
      suspicionBasis: "The customer activity indicates deliberate structuring to avoid $10,000 threshold reporting requirements, alongside transferring funds to an entity (GTC Holdings) exhibiting adverse UBO characteristics.",
      transactionDetails: "On April 9 and April 10, 2026, the entity executed three wire transfers (TXN-9021, TXN-9022, TXN-9024) of varying amounts directly beneath the $10,000 reporting threshold, totaling $28,300 over 48 hours to the same high-risk jurisdiction recipient.",
      customerProfile: "The customer is classified as a Tranche 2 corporate entity dealing in real-estate logistics. The recent flow of funds does not align with their expected KYC velocity profile."
    }
  };
};
