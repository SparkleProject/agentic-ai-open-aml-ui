import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import { useAlerts } from '../hooks/useAlerts';
import { investigateAlert } from '../services/api';
import type { Alert } from '../services/types';
import { Loader, Zap, RefreshCw, AlertTriangle } from 'lucide-react';

export const AlertQueue: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, total, loading, error, refresh } = useAlerts();
  const [investigatingId, setInvestigatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredAlerts = statusFilter
    ? alerts.filter(a => a.status === statusFilter)
    : alerts;

  const handleInvestigate = async (alert: Alert) => {
    setInvestigatingId(alert.id);
    try {
      await investigateAlert(alert.id);
      refresh();
    } catch (err) {
      console.error('Investigation failed:', err);
    } finally {
      setInvestigatingId(null);
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))' };
      case 'high': return { bg: 'hsla(var(--warning) / 0.1)', color: 'hsl(var(--warning))' };
      case 'medium': return { bg: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))' };
      default: return { bg: 'hsla(var(--accent) / 0.1)', color: 'hsl(var(--accent))' };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'investigating': return { bg: 'hsla(var(--warning) / 0.1)', color: 'hsl(var(--warning))' };
      case 'resolved': return { bg: 'hsla(var(--success) / 0.1)', color: 'hsl(var(--success))' };
      case 'escalated': return { bg: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))' };
      case 'false_positive': return { bg: 'hsla(var(--text-muted) / 0.1)', color: 'hsl(var(--text-muted))' };
      default: return { bg: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))' };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const statusLabel = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Alert Queue</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            {total > 0 ? `${total} alert${total !== 1 ? 's' : ''} from backend` : 'Manage and triage incoming AML and Fraud signals.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            id="alert-status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid hsla(var(--border))',
              background: 'hsla(var(--bg-surface))',
              color: 'hsl(var(--text-primary))',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
            <option value="false_positive">False Positive</option>
          </select>
          <Button variant="outline" onClick={refresh}>
            <RefreshCw size={16} style={{ marginRight: '6px' }} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'hsl(var(--error))' }}>
            <AlertTriangle size={20} />
            <div>
              <p style={{ fontWeight: 600 }}>Failed to load alerts</p>
              <p style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))' }}>{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={refresh} style={{ marginLeft: 'auto' }}>Retry</Button>
          </div>
        </Card>
      )}

      <Card>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: '12px' }}>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading alerts from backend...</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'hsl(var(--text-muted))' }}>
            <Zap size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p style={{ fontWeight: 500 }}>No alerts found</p>
            <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
              {statusFilter ? 'Try changing the status filter.' : 'Create alerts in the database to see them here.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
                  <th style={{ padding: '16px', fontWeight: 500 }}>Title</th>
                  <th style={{ padding: '16px', fontWeight: 500 }}>Type</th>
                  <th style={{ padding: '16px', fontWeight: 500 }}>Severity</th>
                  <th style={{ padding: '16px', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '16px', fontWeight: 500 }}>Date</th>
                  <th style={{ padding: '16px', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map(alert => {
                  const sevStyle = getSeverityStyle(alert.severity);
                  const statStyle = getStatusStyle(alert.status);
                  const isInvestigating = investigatingId === alert.id;

                  return (
                    <tr key={alert.id} style={{ borderBottom: '1px solid hsla(var(--border) / 0.5)', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 500, marginBottom: '2px' }}>{alert.title}</div>
                        {alert.description && (
                          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {alert.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'hsla(var(--bg-elevated))', border: '1px solid hsla(var(--border))' }}>
                          {alert.alert_type}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: sevStyle.bg, color: sevStyle.color, textTransform: 'capitalize' }}>
                          {alert.severity}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: statStyle.bg, color: statStyle.color }}>
                          {statusLabel(alert.status)}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        {formatDate(alert.created_at)}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {alert.status === 'new' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleInvestigate(alert)}
                              disabled={isInvestigating}
                            >
                              {isInvestigating ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                  Running…
                                </span>
                              ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Zap size={14} />
                                  Investigate
                                </span>
                              )}
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/cases/${alert.id}`)}>
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
