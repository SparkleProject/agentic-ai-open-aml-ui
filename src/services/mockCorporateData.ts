export type EntityType = 'Corporate' | 'Trust' | 'Individual';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FlagType = 'PEP' | 'SANCTION' | 'ADVERSE_MEDIA';

export interface CorporateEntity {
  id: string;
  name: string;
  type: EntityType;
  jurisdiction: string;
  riskLevel: RiskLevel;
  isUBO: boolean;
  flags: FlagType[];
  registrationNumber?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface EntityRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'OWNS' | 'DIRECTS' | 'TRUSTEE';
  percentage?: number; // Ownership percentage
}

export interface CorporateStructurePayload {
  entities: CorporateEntity[];
  relationships: EntityRelationship[];
}

export const mockCorporateStructure: CorporateStructurePayload = {
  entities: [
    {
      id: 'ent-1',
      name: 'Pacific Trust & Advisory',
      type: 'Trust',
      jurisdiction: 'AU',
      riskLevel: 'CRITICAL',
      isUBO: false,
      flags: [],
      registrationNumber: 'ABN 45 123 456 789',
      address: '123 Trust Lane, Sydney NSW 2000'
    },
    {
      id: 'ent-2',
      name: 'Pacific Nominees Pty Ltd',
      type: 'Corporate',
      jurisdiction: 'AU',
      riskLevel: 'HIGH',
      isUBO: false,
      flags: [],
      registrationNumber: 'ACN 987 654 321',
      address: 'Level 14, 100 George St, Sydney NSW 2000'
    },
    {
      id: 'ent-3',
      name: 'Global Ventures LLC',
      type: 'Corporate',
      jurisdiction: 'Vanuatu',
      riskLevel: 'HIGH',
      isUBO: false,
      flags: [],
      registrationNumber: 'VN-1029384',
      address: 'Port Vila, Vanuatu'
    },
    {
      id: 'ent-4',
      name: 'Arjun Patel',
      type: 'Individual',
      jurisdiction: 'AU',
      riskLevel: 'CRITICAL',
      isUBO: true,
      flags: ['ADVERSE_MEDIA'],
      dateOfBirth: '1975-04-12',
      address: '45 Harbour View Rd, Double Bay NSW 2028'
    },
    {
      id: 'ent-5',
      name: 'Sarah Jenkins',
      type: 'Individual',
      jurisdiction: 'NZ',
      riskLevel: 'LOW',
      isUBO: true,
      flags: [],
      dateOfBirth: '1982-11-23',
      address: '12 Kauri St, Auckland 1010'
    },
    {
      id: 'ent-6',
      name: 'Marcus Chen',
      type: 'Individual',
      jurisdiction: 'SG',
      riskLevel: 'MEDIUM',
      isUBO: false,
      flags: ['PEP'],
      dateOfBirth: '1968-08-05',
      address: '8 Marina Blvd, Singapore 018981'
    }
  ],
  relationships: [
    {
      id: 'rel-1',
      sourceId: 'ent-2',
      targetId: 'ent-1',
      type: 'TRUSTEE',
    },
    {
      id: 'rel-2',
      sourceId: 'ent-3',
      targetId: 'ent-1',
      type: 'OWNS',
      percentage: 100
    },
    {
      id: 'rel-3',
      sourceId: 'ent-4',
      targetId: 'ent-2',
      type: 'DIRECTS'
    },
    {
      id: 'rel-4',
      sourceId: 'ent-6',
      targetId: 'ent-2',
      type: 'DIRECTS'
    },
    {
      id: 'rel-5',
      sourceId: 'ent-4',
      targetId: 'ent-3',
      type: 'OWNS',
      percentage: 60
    },
    {
      id: 'rel-6',
      sourceId: 'ent-5',
      targetId: 'ent-3',
      type: 'OWNS',
      percentage: 40
    }
  ]
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchMockCorporateStructure = async (_customerId: string): Promise<CorporateStructurePayload> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real application, we would use the customerId to fetch the specific structure.
  // For this mock, we always return the same complex structure regardless of the customerId.
  return mockCorporateStructure;
};
