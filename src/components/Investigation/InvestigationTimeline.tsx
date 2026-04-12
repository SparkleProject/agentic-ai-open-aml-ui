import React, { useState } from 'react';
import { Card } from '../Card/Card';

interface ToolCallProps {
  toolName: string;
  payload: string;
}

export const ToolCallInspector: React.FC<ToolCallProps> = ({ toolName, payload }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ marginTop: '8px' }}>
      <button 
        onClick={() => setExpanded(!expanded)} 
        style={{ 
          background: 'none', border: 'none', color: 'hsl(var(--primary))', 
          cursor: 'pointer', fontSize: '0.875rem', padding: '4px 0', fontWeight: 500
        }}
      >
        {expanded ? 'Hide Payload' : `Inspect tool: ${toolName}`}
      </button>
      
      {expanded && (
        <div className="animate-enter" style={{ 
          padding: '12px', 
          backgroundColor: 'hsla(var(--bg-elevated))', 
          borderRadius: '8px', 
          fontSize: '0.875rem', 
          fontFamily: 'monospace',
          border: '1px solid hsla(var(--border))',
          overflowX: 'auto',
          marginTop: '8px'
        }}>
          {payload}
        </div>
      )}
    </div>
  );
};

interface ReActNodeProps {
  stepType: 'Observe' | 'Think' | 'Plan' | 'Act' | 'Reflect';
  content: string;
  toolCall?: { name: string; payload: string };
  isLast?: boolean;
}

export const ReActNode: React.FC<ReActNodeProps> = ({ stepType, content, toolCall, isLast }) => {
  const isAction = stepType === 'Act';
  const color = isAction ? 'hsl(var(--accent))' : 'hsl(var(--text-primary))';
  const dotColor = isAction ? 'hsl(var(--accent))' : 'hsl(var(--border))';

  return (
    <div style={{ 
      padding: '0 0 24px 24px', 
      borderLeft: isLast ? '2px solid transparent' : '2px solid hsla(var(--border) / 0.5)', 
      position: 'relative' 
    }}>
      <div style={{ 
        position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', 
        borderRadius: '50%', backgroundColor: dotColor, boxShadow: `0 0 0 4px hsla(var(--bg-color))` 
      }} />
      <h4 style={{ fontWeight: 600, color, marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
        {stepType}
      </h4>
      <p style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>{content}</p>
      
      {toolCall && (
        <ToolCallInspector toolName={toolCall.name} payload={toolCall.payload} />
      )}
    </div>
  );
};

export const InvestigationTimeline: React.FC = () => {
  const steps: ReActNodeProps[] = [
    { stepType: 'Observe', content: 'Detected sequence of 4 wire transfers $4.2M total, bypassing standard KYC limits by breaking amounts below threshold.' },
    { stepType: 'Think', content: 'The pattern resembles structuring. I need to verify if the recipient entities share a beneficial owner (UBO).' },
    { stepType: 'Plan', content: '1. Resolve corporate structures for recipients\n2. Cross-reference directors with PEP databases' },
    { 
      stepType: 'Act', 
      content: 'Invoking corporate unwrapping tool on Jurisdiction X registry.',
      toolCall: { name: 'unwrap_corporate_structure', payload: '{\n  "entities": ["GTC-001", "GTC-002"],\n  "depth": 3\n}' }
    },
    { stepType: 'Reflect', content: 'Both entities aggregate to a single UBO (John Doe), flagged on adverse media. Recommending case escalation.', isLast: true }
  ];

  return (
    <Card title="Investigation Timeline (Glass Box)" description="Transparent execution trace of the agentic reasoning loop." className="glass">
      <div style={{ marginTop: '16px' }}>
        {steps.map((step, idx) => (
          <ReActNode key={idx} {...step} />
        ))}
      </div>
    </Card>
  );
};
