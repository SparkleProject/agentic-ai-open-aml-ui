import React, { useState } from 'react';
import { Card } from '../Card/Card';
import type { SMRDraftPayload } from '../../services/mockSMRData';

interface EvidenceViewerProps {
  evidence: SMRDraftPayload['evidenceContext'];
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ evidence }) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'kyc'>('transactions');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid hsla(var(--border))', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{
            background: 'none', border: 'none', padding: '8px 16px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            color: activeTab === 'transactions' ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
            borderBottom: activeTab === 'transactions' ? '2px solid hsl(var(--primary))' : '2px solid transparent',
            transition: 'color 0.2s, border-bottom 0.2s'
          }}
        >
          Flagged Transactions
        </button>
        <button
          onClick={() => setActiveTab('kyc')}
          style={{
            background: 'none', border: 'none', padding: '8px 16px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            color: activeTab === 'kyc' ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
            borderBottom: activeTab === 'kyc' ? '2px solid hsl(var(--primary))' : '2px solid transparent',
            transition: 'color 0.2s, border-bottom 0.2s'
          }}
        >
          KYC / Open Alerts
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {activeTab === 'transactions' && (
          <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {evidence.transactions.map(txn => (
              <Card key={txn.id} className={txn.flagged ? "glass" : ""} style={{ borderColor: txn.flagged ? 'hsla(var(--warning) / 0.5)' : '' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{txn.id}</span>
                  <span style={{ fontWeight: 600, color: 'hsl(var(--text-primary))' }}>${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'hsl(var(--text-secondary))' }}>
                  <span>{txn.date}</span>
                  <span>{txn.recipient}</span>
                </div>
                {txn.flagged && (
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'hsl(var(--warning))', backgroundColor: 'hsla(var(--warning) / 0.1)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                    AI Context Match
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {evidence.kycAlerts.map((alert, idx) => (
              <Card key={idx} title={alert.type}>
                <p style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))', marginTop: '4px', lineHeight: 1.5 }}>
                  {alert.description}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
