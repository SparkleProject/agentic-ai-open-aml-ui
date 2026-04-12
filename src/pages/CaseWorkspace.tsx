import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { InvestigationTimeline } from '../components/Investigation/InvestigationTimeline';
import { AgentChatPanel } from '../components/Chat/AgentChatPanel';

export const CaseWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="ghost" onClick={() => navigate('/alerts')} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Case Investigation: {id}</h1>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>Global Trade Corp • High Risk Jurisdiction</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={() => setChatOpen(!chatOpen)}>
            <MessageSquare size={16} style={{ marginRight: '8px' }} />
            {chatOpen ? 'Close Chat' : 'Agent Chat'}
          </Button>
          <Button variant="primary">Resolve Case</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, overflow: 'hidden' }}>
        {/* Main Workspace Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '4px' }}>
          <Card title="Case Summary" description="AI-generated summary of the flagged activity.">
            <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              The entity Global Trade Corp transferred $4.2M to multiple accounts in a high-risk jurisdiction (Jurisdiction X) over a 24-hour period. These transactions bypassed standard velocity thresholds. The AI agent recommends further investigation into beneficial ownership.
            </p>
          </Card>

          <InvestigationTimeline />
        </div>

        {chatOpen && <AgentChatPanel onClose={() => setChatOpen(false)} />}
      </div>
    </div>
  );
};
