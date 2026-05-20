import React, { useState } from 'react';
import { Card } from '../Card/Card';
import type { SMRDraftPayload } from '../../services/mockSMRData';
import { Sparkles } from 'lucide-react';

interface NarrativeEditorProps {
  draft: SMRDraftPayload['narrativeDraft'];
  isSubmitted: boolean;
}

export const NarrativeEditor: React.FC<NarrativeEditorProps> = ({ draft, isSubmitted }) => {
  const [form, setForm] = useState(draft);
  const [isDirty, setIsDirty] = useState({
    suspicionBasis: false,
    transactionDetails: false,
    customerProfile: false
  });

  const handleChange = (field: keyof typeof draft, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (value !== draft[field]) {
      setIsDirty(prev => ({ ...prev, [field]: true }));
    } else {
      setIsDirty(prev => ({ ...prev, [field]: false }));
    }
  };

  const drawTextarea = (label: string, field: keyof typeof draft, rows: number) => {
    const dirty = isDirty[field];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: 'hsl(var(--text-primary))', fontSize: '0.875rem' }}>{label}</label>
          {dirty ? (
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--primary))', backgroundColor: 'hsla(var(--primary) / 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
              Edited by Analyst
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'hsl(var(--primary))' }}>
              <Sparkles size={12} /> AI Draft Placeholder
            </span>
          )}
        </div>
        <textarea
          value={form[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          disabled={isSubmitted}
          rows={rows}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: dirty ? '1px solid hsl(var(--primary))' : '1px solid hsla(var(--border))',
            backgroundColor: isSubmitted ? 'hsla(var(--bg-elevated))' : 'transparent',
            color: dirty ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))',
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s, color 0.2s'
          }}
        />
      </div>
    );
  };

  return (
    <Card 
      className="glass" 
      style={{ 
        height: '100%', 
        overflowY: 'auto', 
        border: '1px solid hsla(var(--primary) / 0.3)',
        boxShadow: '0 4px 20px -2px hsla(var(--primary) / 0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid hsla(var(--border))', paddingBottom: '16px' }}>
        <Sparkles color="hsl(var(--primary))" size={20} />
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>SMR Draft Editor</h3>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>Prepared by Claude 3.5 Sonnet</p>
        </div>
      </div>

      {drawTextarea('Basis of Suspicion', 'suspicionBasis', 4)}
      {drawTextarea('Transaction Details', 'transactionDetails', 5)}
      {drawTextarea('Customer Profile Analysis', 'customerProfile', 3)}
      
    </Card>
  );
};
