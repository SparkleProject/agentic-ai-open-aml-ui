import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';

export const AlertQueue: React.FC = () => {
  const navigate = useNavigate();

  const alerts = [
    { id: 'AL-10492', customer: 'Global Trade Corp', typologies: ['Flow Through', 'High Risk Jurisdiction'], severity: 'High', status: 'Agent Investigating', date: '10 Apr 2026' },
    { id: 'AL-10491', customer: 'Sarah Jenkins', typologies: ['Structuring', 'Rapid Movement'], severity: 'Medium', status: 'Pending Review', date: '10 Apr 2026' },
    { id: 'AL-10490', customer: 'Apex Real Estate', typologies: ['Complex Corporate Structure', 'Adverse Media'], severity: 'Critical', status: 'Escalated', date: '09 Apr 2026' },
  ];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical': return { bg: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))' };
      case 'High': return { bg: 'hsla(var(--warning) / 0.1)', color: 'hsl(var(--warning))' };
      default: return { bg: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))' };
    }
  };

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Alert Queue</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            Manage and triage incoming AML and Fraud signals.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline">Filter</Button>
          <Button variant="primary">Export View</Button>
        </div>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
                <th style={{ padding: '16px', fontWeight: 500 }}>Alert ID</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Customer</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Typologies</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Severity</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '16px', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => {
                const sStyle = getSeverityStyle(alert.severity);
                return (
                  <tr key={alert.id} style={{ borderBottom: '1px solid hsla(var(--border) / 0.5)' }}>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{alert.id}</td>
                    <td style={{ padding: '16px', color: 'hsl(var(--text-primary))' }}>{alert.customer}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {alert.typologies.map((typ, i) => (
                          <span key={i} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: 'hsla(var(--bg-elevated))', border: '1px solid hsla(var(--border))' }}>
                            {typ}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: sStyle.bg, color: sStyle.color }}>
                        {alert.severity}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>{alert.status}</td>
                    <td style={{ padding: '16px', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>{alert.date}</td>
                    <td style={{ padding: '16px' }}>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/cases/${alert.id}`)}>Review</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
