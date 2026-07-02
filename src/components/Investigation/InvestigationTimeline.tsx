import React, { useState } from 'react';
import { Card } from '../Card/Card';
import type { Observation } from '../../services/types';

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
  agent?: string;
}

export const ReActNode: React.FC<ReActNodeProps> = ({ stepType, content, toolCall, isLast, agent }) => {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <h4 style={{ fontWeight: 600, color, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          {stepType}
        </h4>
        {agent && (
          <span style={{
            padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 500,
            backgroundColor: 'hsla(var(--accent) / 0.1)', color: 'hsl(var(--accent))',
          }}>
            {agent}
          </span>
        )}
      </div>
      <p style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>{content}</p>
      
      {toolCall && (
        <ToolCallInspector toolName={toolCall.name} payload={toolCall.payload} />
      )}
    </div>
  );
};

// ---------- Static fallback data ----------

const staticSteps: ReActNodeProps[] = [
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

// ---------- Main Component ----------

interface InvestigationTimelineProps {
  observations?: Observation[];
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({ observations }) => {
  // Convert real observations to ReActNode format
  const hasRealData = observations && observations.length > 0;

  const steps: ReActNodeProps[] = hasRealData
    ? observations.map((obs, idx) => ({
        stepType: (obs.step_type || inferStepType(obs)) as ReActNodeProps['stepType'],
        content: obs.content || obs.tool_result || JSON.stringify(obs),
        toolCall: obs.tool_name ? { name: obs.tool_name, payload: obs.tool_result || '(no payload)' } : undefined,
        isLast: idx === observations.length - 1,
        agent: obs.agent,
      }))
    : staticSteps;

  return (
    <Card 
      title="Investigation Timeline (Glass Box)" 
      description={hasRealData ? 'Live execution trace from the agent orchestrator.' : 'Transparent execution trace of the agentic reasoning loop.'}
      className="glass"
    >
      {!hasRealData && (
        <div style={{
          padding: '8px 12px', borderRadius: '8px', marginBottom: '16px',
          backgroundColor: 'hsla(var(--warning) / 0.08)', border: '1px solid hsla(var(--warning) / 0.15)',
          fontSize: '0.8rem', color: 'hsl(var(--text-secondary))',
        }}>
          ⚡ Showing demo data — run an investigation to see live agent traces.
        </div>
      )}
      <div style={{ marginTop: '16px' }}>
        {steps.map((step, idx) => (
          <ReActNode key={idx} {...step} />
        ))}
      </div>
    </Card>
  );
};

/**
 * Best-effort inference of step type from an observation object
 * when the backend doesn't include an explicit step_type field.
 */
function inferStepType(obs: Observation): string {
  if (obs.tool_name) return 'Act';
  const content = (obs.content || '').toLowerCase();
  if (content.includes('plan') || content.includes('strategy')) return 'Plan';
  if (content.includes('conclude') || content.includes('recommend') || content.includes('reflect')) return 'Reflect';
  if (content.includes('observe') || content.includes('detect') || content.includes('found')) return 'Observe';
  return 'Think';
}
