import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Building2, User, Shield, AlertTriangle } from 'lucide-react';
import type { CorporateEntity } from '../../../services/mockCorporateData';
import { Card } from '../../Card/Card';

type EntityNodeProps = NodeProps & {
  data: CorporateEntity;
};

export const EntityNode: React.FC<EntityNodeProps> = ({ data, selected }) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'hsl(var(--error))';
      case 'HIGH': return 'hsl(var(--error))';
      case 'MEDIUM': return 'hsl(var(--warning))';
      case 'LOW': return 'hsl(var(--success))';
      default: return 'hsl(var(--border))';
    }
  };

  const getIcon = () => {
    switch (data.type) {
      case 'Corporate': return <Building2 size={24} color="hsl(var(--text-secondary))" />;
      case 'Individual': return <User size={24} color="hsl(var(--text-secondary))" />;
      case 'Trust': return <Shield size={24} color="hsl(var(--text-secondary))" />;
    }
  };

  const riskColor = getRiskColor(data.riskLevel);

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <div 
        style={{ 
          width: '280px', 
          transition: 'transform 0.2s, box-shadow 0.2s',
          transform: selected ? 'scale(1.02)' : 'scale(1)',
          cursor: 'pointer'
        }}
      >
        <Card 
          glass 
          style={{ 
            borderTop: `4px solid ${riskColor}`,
            border: selected ? `2px solid hsl(var(--primary))` : `1px solid hsla(var(--border) / 0.5)`,
            borderTopWidth: selected ? '4px' : '4px',
            borderTopColor: riskColor,
            boxShadow: selected ? '0 8px 30px hsla(var(--primary) / 0.2)' : '0 4px 15px hsla(var(--background) / 0.1)',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              backgroundColor: 'hsla(var(--bg-elevated))' 
            }}>
              {getIcon()}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'hsl(var(--text-primary))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {data.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', marginTop: '2px' }}>
                {data.type} • {data.jurisdiction}
              </div>

              {/* Badges Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                {data.isUBO && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    backgroundColor: 'hsla(var(--primary-transparent))', 
                    color: 'hsl(var(--primary))', 
                    padding: '2px 6px', 
                    borderRadius: '4px' 
                  }}>
                    UBO
                  </span>
                )}
                {data.flags.includes('PEP') && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    backgroundColor: 'hsla(var(--warning) / 0.1)', 
                    color: 'hsl(var(--warning))', 
                    padding: '2px 6px', 
                    borderRadius: '4px' 
                  }}>
                    PEP
                  </span>
                )}
                {(data.flags.includes('SANCTION') || data.flags.includes('ADVERSE_MEDIA')) && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    backgroundColor: 'hsla(var(--error) / 0.1)', 
                    color: 'hsl(var(--error))', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <AlertTriangle size={10} />
                    {data.flags.includes('SANCTION') ? 'SANCTION' : 'ADVERSE MEDIA'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </>
  );
};
