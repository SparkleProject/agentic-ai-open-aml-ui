import React, { useState, useEffect } from 'react';
import { Card } from '../Card/Card';
import type { RiskScoreBreakdown } from '../../services/mockKYCData';

interface RiskBreakdownChartProps {
  breakdown: RiskScoreBreakdown[];
}

const getBarColor = (score: number): string => {
  if (score <= 30) return 'var(--success)';
  if (score <= 60) return 'var(--warning)';
  if (score <= 80) return '30 90% 50%'; // orange
  return 'var(--error)';
};

export const RiskBreakdownChart: React.FC<RiskBreakdownChartProps> = ({ breakdown }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card title="Risk Score Breakdown">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {breakdown.map((item) => {
          const color = getBarColor(item.score);
          return (
            <div key={item.category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Label row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'hsl(var(--text-primary))',
                }}>
                  {item.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: `hsl(${color})`,
                  }}>
                    {item.score}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'hsl(var(--text-muted))',
                  }}>
                    / 100
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div style={{
                height: '8px',
                borderRadius: '4px',
                backgroundColor: 'hsla(var(--bg-elevated))',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: animated ? `${item.score}%` : '0%',
                  height: '100%',
                  borderRadius: '4px',
                  backgroundColor: `hsl(${color})`,
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />
              </div>

              {/* Signals */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                paddingLeft: '4px',
              }}>
                {item.signals.map((signal, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.75rem',
                    color: 'hsl(var(--text-muted))',
                    lineHeight: 1.4,
                  }}>
                    • {signal}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
