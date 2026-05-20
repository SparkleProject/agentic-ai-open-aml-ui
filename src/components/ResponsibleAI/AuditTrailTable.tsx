import React from 'react';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import type { AuditLogEntry } from '../../services/mockAuditTrailData';

interface AuditTrailTableProps {
  logs: AuditLogEntry[];
  onInspect: (log: AuditLogEntry) => void;
  selectedId?: string;
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ logs, onInspect, selectedId }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUCCESS': return { bg: 'hsla(var(--success) / 0.1)', color: 'hsl(var(--success))' };
      case 'ERROR': return { bg: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))' };
      case 'HUMAN_OVERRIDE': return { bg: 'hsla(var(--warning) / 0.1)', color: 'hsl(var(--warning))' };
      default: return { bg: 'transparent', color: 'inherit' };
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <Card glass>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
              <th style={{ padding: '16px', fontWeight: 500 }}>Timestamp</th>
              <th style={{ padding: '16px', fontWeight: 500 }}>Log ID</th>
              <th style={{ padding: '16px', fontWeight: 500 }}>Agent</th>
              <th style={{ padding: '16px', fontWeight: 500 }}>Action</th>
              <th style={{ padding: '16px', fontWeight: 500 }}>Model</th>
              <th style={{ padding: '16px', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 500, textAlign: 'right' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                  No audit logs found matching the criteria.
                </td>
              </tr>
            ) : (
              logs.map(log => {
                const sStyle = getStatusStyle(log.status);
                const isSelected = log.id === selectedId;
                return (
                  <tr 
                    key={log.id} 
                    style={{ 
                      borderBottom: '1px solid hsla(var(--border) / 0.5)',
                      backgroundColor: isSelected ? 'hsla(var(--primary) / 0.05)' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                      {formatDate(log.timestamp)}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'hsl(var(--text-primary))' }}>
                      {log.id}
                    </td>
                    <td style={{ padding: '16px', color: 'hsl(var(--text-primary))' }}>
                      {log.agentId}
                    </td>
                    <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        backgroundColor: 'hsla(var(--bg-elevated))', 
                        border: '1px solid hsla(var(--border))' 
                      }}>
                        {log.modelId}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        backgroundColor: sStyle.bg, 
                        color: sStyle.color 
                      }}>
                        {log.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Button variant="ghost" size="sm" onClick={() => onInspect(log)}>
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
