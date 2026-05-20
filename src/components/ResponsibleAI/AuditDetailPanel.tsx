import React from 'react';
import { X, Clock, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import type { AuditLogEntry } from '../../services/mockAuditTrailData';

interface AuditDetailPanelProps {
  log: AuditLogEntry;
  onClose: () => void;
}

export const AuditDetailPanel: React.FC<AuditDetailPanelProps> = ({ log, onClose }) => {
  return (
    <div style={{
      width: '500px',
      height: '100%',
      backgroundColor: 'hsla(var(--bg-elevated))',
      borderLeft: '1px solid hsla(var(--border) / 0.5)',
      boxShadow: '-8px 0 30px hsla(var(--background) / 0.3)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '24px', 
        borderBottom: '1px solid hsla(var(--border) / 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
            {log.action}
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
            ID: {log.id} • {log.caseId}
          </p>
        </div>
        <button 
          onClick={onClose}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            color: 'hsl(var(--text-secondary))',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Agent
            </div>
            <div style={{ color: 'hsl(var(--text-primary))', fontWeight: 500 }}>
              {log.agentId}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Model
            </div>
            <div style={{ color: 'hsl(var(--text-primary))', fontWeight: 500 }}>
              {log.modelId}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Timestamp
            </div>
            <div style={{ color: 'hsl(var(--text-primary))', fontSize: '0.875rem' }}>
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tenant ID
            </div>
            <div style={{ color: 'hsl(var(--text-primary))', fontSize: '0.875rem' }}>
              {log.tenantId}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          padding: '16px', 
          backgroundColor: 'hsla(var(--background) / 0.5)',
          borderRadius: '8px',
          border: '1px solid hsla(var(--border) / 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <Database size={16} color="hsl(var(--text-secondary))" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>Tokens (In / Out)</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{log.inputTokens} / {log.outputTokens}</div>
            </div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'hsla(var(--border) / 0.5)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <Clock size={16} color="hsl(var(--text-secondary))" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>Latency</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{log.latencyMs}ms</div>
            </div>
          </div>
        </div>

        {/* Chain of Thought */}
        {log.details.reasoningChain && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'hsl(var(--text-primary))', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="hsl(var(--success))" />
              Reasoning Chain
            </h3>
            <div style={{ 
              backgroundColor: 'hsla(var(--success) / 0.05)', 
              border: '1px solid hsla(var(--success) / 0.2)',
              borderRadius: '8px',
              padding: '16px',
              color: 'hsl(var(--text-primary))',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {log.details.reasoningChain}
            </div>
          </div>
        )}

        {/* Prompt */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'hsl(var(--text-primary))', marginBottom: '8px' }}>
            System Prompt & Input
          </h3>
          <pre style={{ 
            backgroundColor: '#1E1E1E', // Dark editor theme
            borderRadius: '8px',
            padding: '16px',
            color: '#D4D4D4',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            margin: 0
          }}>
            {log.details.prompt}
          </pre>
        </div>

        {/* Response */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'hsl(var(--text-primary))', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {log.status === 'ERROR' ? <AlertTriangle size={16} color="hsl(var(--error))" /> : null}
            Model Output
          </h3>
          <pre style={{ 
            backgroundColor: '#1E1E1E',
            border: log.status === 'ERROR' ? '1px solid hsl(var(--error))' : 'none',
            borderRadius: '8px',
            padding: '16px',
            color: log.status === 'ERROR' ? '#FF8A8A' : '#CE9178', // JSON string color typically
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            margin: 0
          }}>
            {log.details.response}
          </pre>
        </div>

      </div>
    </div>
  );
};
