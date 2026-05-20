import React from 'react';
import { Card } from '../Card/Card';
import type { RiskLevel } from '../../services/mockKYCData';

interface RiskScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: 'var(--success)',
  MEDIUM: 'var(--warning)',
  HIGH: 'var(--error)',
  CRITICAL: 'var(--error)',
};

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score, riskLevel }) => {
  const color = RISK_COLORS[riskLevel];
  const isCritical = riskLevel === 'CRITICAL';

  // SVG circle math
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card title="Risk Assessment" glass>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        gap: '16px',
      }}>
        {/* SVG Gauge */}
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg
            width={size}
            height={size}
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsla(var(--bg-elevated))"
              strokeWidth={strokeWidth}
            />
            {/* Score arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`hsl(${color})`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: isCritical ? `drop-shadow(0 0 6px hsl(${color}))` : 'none',
              }}
            />
          </svg>
          {/* Centre score */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: `hsl(${color})`,
              lineHeight: 1,
            }}>
              {score}
            </span>
            <span style={{
              fontSize: '0.7rem',
              color: 'hsl(var(--text-muted))',
              marginTop: '2px',
            }}>
              / 100
            </span>
          </div>
        </div>

        {/* Risk level badge */}
        <div style={{
          padding: '6px 16px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: `hsl(${color})`,
          backgroundColor: `hsla(${color} / 0.12)`,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          animation: isCritical ? 'riskPulse 2s ease-in-out infinite' : 'none',
        }}>
          {riskLevel} RISK
        </div>

        {isCritical && (
          <style>{`
            @keyframes riskPulse {
              0%, 100% { box-shadow: 0 0 0 0 hsla(${color} / 0.3); }
              50% { box-shadow: 0 0 0 8px hsla(${color} / 0); }
            }
          `}</style>
        )}
      </div>
    </Card>
  );
};
