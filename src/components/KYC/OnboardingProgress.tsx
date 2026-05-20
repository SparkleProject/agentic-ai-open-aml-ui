import React from 'react';
import type { OnboardingStage } from '../../services/mockKYCData';

interface OnboardingProgressProps {
  stage: OnboardingStage;
  progress: number;
  compact?: boolean; // mini mode for table rows
}

const STAGES: { key: OnboardingStage; label: string }[] = [
  { key: 'IDENTITY', label: 'Identity' },
  { key: 'SCREENING', label: 'Screening' },
  { key: 'RISK_ASSESSMENT', label: 'Risk Assessment' },
  { key: 'APPROVAL', label: 'Approval' },
  { key: 'COMPLETE', label: 'Complete' },
];

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ stage, progress, compact = false }) => {
  const currentIdx = STAGES.findIndex(s => s.key === stage);
  const isComplete = stage === 'COMPLETE';

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
        <div style={{
          flex: 1,
          height: '6px',
          borderRadius: '3px',
          backgroundColor: 'hsla(var(--bg-elevated))',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: '3px',
            backgroundColor: isComplete ? 'hsl(var(--success))' : 'hsl(var(--primary))',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--text-secondary))', whiteSpace: 'nowrap' }}>
          {progress}%
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Segmented bar */}
      <div style={{ display: 'flex', gap: '2px', height: '10px' }}>
        {STAGES.map((s, idx) => {
          const isPast = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          let bgColor = 'hsla(var(--bg-elevated))';
          if (isComplete || isPast) bgColor = 'hsl(var(--primary))';
          else if (isCurrent) bgColor = 'hsl(var(--accent))';

          return (
            <div
              key={s.key}
              style={{
                flex: 1,
                backgroundColor: bgColor,
                borderRadius: idx === 0 ? '5px 0 0 5px' : idx === STAGES.length - 1 ? '0 5px 5px 0' : '0',
                transition: 'background-color 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isCurrent && !isComplete && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  animation: 'kycPulse 2s ease-in-out infinite',
                  backgroundColor: 'hsla(var(--accent) / 0.4)',
                  borderRadius: 'inherit',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Stage labels */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {STAGES.map((s, idx) => {
          const isCurrent = idx === currentIdx;
          return (
            <div key={s.key} style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.7rem',
              fontWeight: isCurrent ? 700 : 400,
              color: isCurrent ? 'hsl(var(--text-primary))' : 'hsl(var(--text-muted))',
              transition: 'color 0.3s ease',
            }}>
              {s.label}
            </div>
          );
        })}
      </div>

      {/* Inject keyframes */}
      <style>{`
        @keyframes kycPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
