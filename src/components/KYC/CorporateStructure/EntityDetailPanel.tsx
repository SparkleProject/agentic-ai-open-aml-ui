import React from 'react';
import { X, Building2, User, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import type { CorporateEntity } from '../../../services/mockCorporateData';
import { Card } from '../../Card/Card';
import { Button } from '../../Button/Button';

interface EntityDetailPanelProps {
  entity: CorporateEntity;
  onClose: () => void;
}

export const EntityDetailPanel: React.FC<EntityDetailPanelProps> = ({ entity, onClose }) => {
  const getIcon = () => {
    switch (entity.type) {
      case 'Corporate': return <Building2 size={32} color="hsl(var(--primary))" />;
      case 'Individual': return <User size={32} color="hsl(var(--primary))" />;
      case 'Trust': return <Shield size={32} color="hsl(var(--primary))" />;
    }
  };

  const isHighRisk = entity.riskLevel === 'HIGH' || entity.riskLevel === 'CRITICAL';

  return (
    <Card 
      glass 
      style={{ 
        width: '380px', 
        height: '100%', 
        overflowY: 'auto',
        borderLeft: '1px solid hsla(var(--border) / 0.5)',
        borderRadius: '0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Entity Details</h3>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'hsl(var(--text-muted))',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'hsla(var(--primary-transparent))', height: 'fit-content' }}>
          {getIcon()}
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--text-primary))', marginBottom: '4px' }}>
            {entity.name}
          </h2>
          <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))' }}>
            {entity.type} • {entity.jurisdiction}
          </div>
          {entity.isUBO && (
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'hsla(var(--primary-transparent))', color: 'hsl(var(--primary))', padding: '4px 8px', borderRadius: '4px' }}>
                Ultimate Beneficial Owner (UBO)
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {/* Risk Section */}
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          backgroundColor: isHighRisk ? 'hsla(var(--error) / 0.1)' : 'hsla(var(--success) / 0.1)',
          border: `1px solid ${isHighRisk ? 'hsla(var(--error) / 0.3)' : 'hsla(var(--success) / 0.3)'}`
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: isHighRisk ? 'hsl(var(--error))' : 'hsl(var(--success))', marginBottom: '8px' }}>
            Risk Assessment
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: isHighRisk ? 'hsl(var(--error))' : 'hsl(var(--success))' }}>
            {entity.riskLevel} RISK
          </div>
          
          {entity.flags.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {entity.flags.map(flag => (
                <div key={flag} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'hsl(var(--text-primary))' }}>
                  <AlertTriangle size={16} color="hsl(var(--error))" />
                  {flag.replace('_', ' ')} Match
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Identity Details */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'hsl(var(--text-muted))', marginBottom: '12px' }}>
            Identity Information
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entity.registrationNumber && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>Registration Number</div>
                <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-primary))', fontWeight: 500 }}>{entity.registrationNumber}</div>
              </div>
            )}
            
            {entity.dateOfBirth && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>Date of Birth</div>
                <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-primary))', fontWeight: 500 }}>{entity.dateOfBirth}</div>
              </div>
            )}
            
            {entity.address && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>Registered Address</div>
                <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-primary))', fontWeight: 500 }}>{entity.address}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid hsla(var(--border) / 0.5)' }}>
        <Button variant="outline" fullWidth>
          <ExternalLink size={16} style={{ marginRight: '8px' }} />
          View Registry Source
        </Button>
      </div>
    </Card>
  );
};
