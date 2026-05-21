import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { Button } from '../Button/Button';

export const RLHFWidget: React.FC = () => {
  const [state, setState] = useState<'IDLE' | 'RATING_NEGATIVE' | 'SUBMITTED'>('IDLE');
  const [category, setCategory] = useState('');
  const [reasoning, setReasoning] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 'RATING_NEGATIVE') {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [state]);

  const handlePositive = () => {
    // In a real app, send positive signal to backend
    setState('SUBMITTED');
  };

  const handleNegative = () => {
    setState('RATING_NEGATIVE');
  };

  const handleSubmitFeedback = () => {
    if (!category || !reasoning.trim()) return;
    // In a real app, send negative signal + reasoning to backend
    setState('SUBMITTED');
  };

  if (state === 'SUBMITTED') {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '12px 16px', 
        backgroundColor: 'hsla(var(--success) / 0.1)',
        border: '1px solid hsla(var(--success) / 0.3)',
        borderRadius: '8px',
        color: 'hsl(var(--success))',
        fontSize: '0.875rem',
        marginTop: '16px'
      }}>
        <CheckCircle size={18} />
        <span>Thank you! Your feedback helps improve the AI agent.</span>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid hsla(var(--border) / 0.5)', paddingTop: '16px' }}>
      {state === 'IDLE' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.875rem', color: 'hsl(var(--text-secondary))' }}>
            Was this AI summary helpful?
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handlePositive}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px', borderRadius: '6px', border: '1px solid hsla(var(--border) / 0.5)',
                backgroundColor: 'hsla(var(--bg-elevated))', cursor: 'pointer',
                color: 'hsl(var(--text-secondary))', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'hsl(var(--success))'; e.currentTarget.style.borderColor = 'hsl(var(--success))'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'hsl(var(--text-secondary))'; e.currentTarget.style.borderColor = 'hsla(var(--border) / 0.5)'; }}
            >
              <ThumbsUp size={16} />
            </button>
            <button 
              onClick={handleNegative}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px', borderRadius: '6px', border: '1px solid hsla(var(--border) / 0.5)',
                backgroundColor: 'hsla(var(--bg-elevated))', cursor: 'pointer',
                color: 'hsl(var(--text-secondary))', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'hsl(var(--error))'; e.currentTarget.style.borderColor = 'hsl(var(--error))'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'hsl(var(--text-secondary))'; e.currentTarget.style.borderColor = 'hsla(var(--border) / 0.5)'; }}
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        </div>
      )}

      {state === 'RATING_NEGATIVE' && (
        <div 
          ref={formRef}
          style={{ 
          display: 'flex', flexDirection: 'column', gap: '12px',
          padding: '16px', backgroundColor: 'hsla(var(--background) / 0.5)',
          border: '1px solid hsla(var(--border) / 0.5)', borderRadius: '8px',
          animation: 'fadeIn 0.3s ease-out',
          marginBottom: '8px'
        }}>
          <h4 style={{ margin: 0, fontSize: '0.875rem', color: 'hsl(var(--text-primary))' }}>
            Help us improve the model
          </h4>
          
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid hsla(var(--border) / 0.5)',
              backgroundColor: 'hsla(var(--bg-elevated))',
              color: 'hsl(var(--text-primary))',
              outline: 'none',
              fontSize: '0.875rem'
            }}
          >
            <option value="" disabled>Select error category...</option>
            <option value="HALLUCINATION">Hallucinated Data</option>
            <option value="MISSING_CONTEXT">Ignored Important Context</option>
            <option value="INCORRECT_POLICY">Applied Wrong Policy</option>
            <option value="OTHER">Other</option>
          </select>

          <textarea 
            placeholder="Please provide the corrected reasoning or missing details..."
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid hsla(var(--border) / 0.5)',
              backgroundColor: 'hsla(var(--bg-elevated))',
              color: 'hsl(var(--text-primary))',
              outline: 'none',
              fontSize: '0.875rem',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" size="sm" onClick={() => setState('IDLE')}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSubmitFeedback} disabled={!category || !reasoning.trim()}>
              Submit Feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
