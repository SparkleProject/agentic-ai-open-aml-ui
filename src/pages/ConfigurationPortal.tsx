import React from 'react';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';

export const ConfigurationPortal: React.FC = () => {
  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '8px' }}>Tenant Configuration</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            Manage risk appetites, assign AI models, and set global cost thresholds.
          </p>
        </div>
        <Button variant="primary">Save Configuration</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card title="Risk Appetite Slider" description="Set the threshold for generic vs specialized agents." glass>
          <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
              <span>AML Alert Threshold</span>
              <span style={{ color: 'hsl(var(--primary))' }}>Medium (5.0)</span>
            </label>
            <input type="range" min="0" max="10" step="0.1" defaultValue="5.0" style={{ width: '100%', accentColor: 'hsl(var(--primary))' }} />
          </div>
        </Card>

        <Card title="Model Selection" description="Assign primary reasoning models for specific tasks.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '16px', border: '1px solid hsl(var(--primary))', borderRadius: '8px', backgroundColor: 'hsla(var(--primary-transparent))', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Claude 3.5 Sonnet</div>
                <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))' }}>AWS Bedrock — Primary Orchestrator</div>
              </div>
              <div style={{ backgroundColor: 'hsl(var(--primary))', color: 'white', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '12px', height: 'fit-content' }}>Active</div>
            </div>
            <div style={{ padding: '16px', border: '1px solid hsl(var(--border))', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Titan Embeddings</div>
                <div style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))' }}>AWS Bedrock — RAG Retrieval</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Cost & Usage Thresholds" description="Set soft and hard limits for agentic operations per month.">
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Monthly Budget (USD)</label>
            <input type="number" defaultValue={5000} style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'transparent', color: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Alert Email</label>
            <input type="email" placeholder="compliance@example.com" style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'transparent', color: 'inherit', outline: 'none' }} />
          </div>
        </div>
      </Card>
    </div>
  );
};
