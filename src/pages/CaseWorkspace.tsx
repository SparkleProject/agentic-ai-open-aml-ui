import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import { ArrowLeft, MessageSquare, Loader, AlertTriangle } from 'lucide-react';
import { InvestigationTimeline } from '../components/Investigation/InvestigationTimeline';
import { AgentChatPanel } from '../components/Chat/AgentChatPanel';
import { RLHFWidget } from '../components/ResponsibleAI/RLHFWidget';
import { useAlert } from '../hooks/useAlert';

export const CaseWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const { alert, loading, error } = useAlert(id);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'hsla(var(--error) / 0.1)', color: 'hsl(var(--error))' };
      case 'high': return { bg: 'hsla(var(--warning) / 0.1)', color: 'hsl(var(--warning))' };
      default: return { bg: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))' };
    }
  };

  const statusLabel = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
        <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading case data...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
        <AlertTriangle size={40} style={{ color: 'hsl(var(--error))', opacity: 0.6 }} />
        <h2 style={{ fontWeight: 600 }}>Unable to load case</h2>
        <p style={{ color: 'hsl(var(--text-secondary))', maxWidth: '400px', textAlign: 'center' }}>
          {error || `Alert with ID "${id}" was not found.`}
        </p>
        <Button variant="outline" onClick={() => navigate('/alerts')}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to Alerts
        </Button>
      </div>
    );
  }

  const conclusion = alert.details?.agent_conclusion;
  const observations = alert.details?.observations;
  const triage = alert.details?.triage;
  const sevStyle = getSeverityStyle(alert.severity);

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="ghost" onClick={() => navigate('/alerts')} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.5rem' }}>{alert.title}</h1>
              <span style={{
                padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                backgroundColor: sevStyle.bg, color: sevStyle.color, textTransform: 'capitalize',
              }}>
                {alert.severity}
              </span>
            </div>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
              {alert.alert_type} • {statusLabel(alert.status)} • ID: {alert.id.slice(0, 8)}…
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={() => setChatOpen(!chatOpen)}>
            <MessageSquare size={16} style={{ marginRight: '8px' }} />
            {chatOpen ? 'Close Chat' : 'Agent Chat'}
          </Button>
          <Button variant="primary" onClick={() => navigate(`/reports/smr/${id}`)}>Review SMR Draft</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, overflow: 'hidden' }}>
        {/* Main Workspace Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '4px' }}>
          {/* Triage Result */}
          {triage && (
            <Card title="Triage Result" description={`Decision: ${triage.decision}`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                    backgroundColor: triage.decision === 'AUTO_CLEAR' ? 'hsla(var(--success) / 0.1)' : 'hsla(var(--warning) / 0.1)',
                    color: triage.decision === 'AUTO_CLEAR' ? 'hsl(var(--success))' : 'hsl(var(--warning))',
                  }}>
                    {triage.decision}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'hsl(var(--text-muted))' }}>
                    Confidence: {Math.round((triage.confidence || 0) * 100)}%
                  </span>
                </div>
                <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: 1.6, fontSize: '0.875rem' }}>
                  {triage.rationale}
                </p>
                {triage.matched_typologies && triage.matched_typologies.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {triage.matched_typologies.map((typ: string, i: number) => (
                      <span key={i} style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem',
                        backgroundColor: 'hsla(var(--bg-elevated))', border: '1px solid hsla(var(--border))',
                      }}>
                        {typ}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Agent Conclusion */}
          <Card title="Case Summary" description={conclusion ? 'AI-generated investigation conclusion.' : 'No investigation has been run yet.'}>
            {conclusion ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {conclusion.narrative && (
                  <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
                    {conclusion.narrative}
                  </p>
                )}
                {conclusion.recommendation && (
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'hsla(var(--primary) / 0.05)', border: '1px solid hsla(var(--primary) / 0.15)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--primary))', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      Recommendation
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))' }}>{conclusion.recommendation}</p>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: 'hsl(var(--text-muted))', lineHeight: 1.6, fontStyle: 'italic' }}>
                {alert.description || 'Run the investigation from the Alert Queue to generate agent findings.'}
              </p>
            )}
            <RLHFWidget />
          </Card>

          {/* Investigation Timeline */}
          <InvestigationTimeline observations={observations} />
        </div>

        {chatOpen && <AgentChatPanel onClose={() => setChatOpen(false)} />}
      </div>
    </div>
  );
};
