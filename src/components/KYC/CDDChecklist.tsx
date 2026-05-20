import React from 'react';
import { Card } from '../Card/Card';
import { CheckCircle, Loader, Clock, XCircle, Sparkles } from 'lucide-react';
import type { CDDChecklistItem } from '../../services/mockKYCData';

interface CDDChecklistProps {
  items: CDDChecklistItem[];
}

const CATEGORY_ORDER: CDDChecklistItem['category'][] = ['identity', 'screening', 'documentation', 'risk'];

const CATEGORY_LABELS: Record<CDDChecklistItem['category'], string> = {
  identity: 'IDENTITY VERIFICATION',
  screening: 'SCREENING CHECKS',
  documentation: 'DOCUMENTATION',
  risk: 'RISK & APPROVAL',
};

const STATUS_ICON: Record<CDDChecklistItem['status'], React.ReactNode> = {
  COMPLETE: <CheckCircle size={16} color="hsl(var(--success))" />,
  IN_PROGRESS: <Loader size={16} color="hsl(var(--accent))" style={{ animation: 'spin 2s linear infinite' }} />,
  PENDING: <Clock size={16} color="hsl(var(--text-muted))" />,
  FAILED: <XCircle size={16} color="hsl(var(--error))" />,
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export const CDDChecklist: React.FC<CDDChecklistProps> = ({ items }) => {
  const completeCount = items.filter(i => i.status === 'COMPLETE').length;
  const grouped = CATEGORY_ORDER
    .map(cat => ({ category: cat, items: items.filter(i => i.category === cat) }))
    .filter(g => g.items.length > 0);

  return (
    <Card
      title="CDD Checklist"
      description={`${completeCount} of ${items.length} complete`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {grouped.map(group => (
          <div key={group.category}>
            {/* Category header */}
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'hsl(var(--text-muted))',
              letterSpacing: '0.05em',
              padding: '0 0 8px 0',
              borderBottom: '1px solid hsla(var(--border) / 0.5)',
              marginBottom: '4px',
            }}>
              {CATEGORY_LABELS[group.category]}
            </div>

            {/* Items */}
            {group.items.map((item, idx) => {
              const isFailed = item.status === 'FAILED';
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'hsla(var(--bg-elevated) / 0.5)',
                    borderLeft: isFailed ? '3px solid hsl(var(--error))' : '3px solid transparent',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {/* Left: icon + label */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                      {STATUS_ICON[item.status]}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: isFailed || item.status === 'IN_PROGRESS' ? 600 : 400,
                        color: isFailed ? 'hsl(var(--error))' : 'hsl(var(--text-primary))',
                      }}>
                        {item.label}
                      </span>
                      {item.notes && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: isFailed ? 'hsl(var(--error))' : 'hsl(var(--text-muted))',
                          lineHeight: 1.4,
                          maxWidth: '320px',
                        }}>
                          {item.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: agent pill or timestamp */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    {item.automatedBy && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        backgroundColor: 'hsla(var(--primary-transparent))',
                        color: 'hsl(var(--primary))',
                        whiteSpace: 'nowrap',
                      }}>
                        <Sparkles size={10} />
                        {item.automatedBy}
                      </span>
                    )}
                    {item.completedAt && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'hsl(var(--text-muted))',
                        whiteSpace: 'nowrap',
                      }}>
                        {formatDate(item.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Card>
  );
};
