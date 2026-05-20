import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card } from '../Card/Card';
import type { BiasMetric } from '../../services/mockResponsibleAIData';

interface BiasMetricsCardProps {
  metrics: BiasMetric[];
}

export const BiasMetricsCard: React.FC<BiasMetricsCardProps> = ({ metrics }) => {
  return (
    <Card title="Fairness & Bias Metrics" glass>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
        {metrics.map((item, index) => {
          const isWarning = item.status === 'WARNING';
          const isFail = item.status === 'FAIL';
          
          let iconColor = 'hsl(var(--success))';
          let bgColor = 'hsla(var(--success) / 0.1)';
          let Icon = ShieldCheck;
          
          if (isWarning) {
            iconColor = 'hsl(var(--warning))';
            bgColor = 'hsla(var(--warning) / 0.1)';
            Icon = AlertTriangle;
          } else if (isFail) {
            iconColor = 'hsl(var(--error))';
            bgColor = 'hsla(var(--error) / 0.1)';
            Icon = ShieldAlert;
          }

          return (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '16px',
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${bgColor}`,
              backgroundColor: 'hsla(var(--bg-elevated))'
            }}>
              <div style={{ 
                padding: '12px', 
                borderRadius: '8px', 
                backgroundColor: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon color={iconColor} size={24} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
                    {item.metric}
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    gap: '4px' 
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: iconColor }}>
                      {(item.score * 100).toFixed(1)}%
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
                      (Target: &ge;{(item.threshold * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
                  {item.description}
                </p>
                
                {/* Progress bar visual */}
                <div style={{ 
                  marginTop: '12px', 
                  height: '6px', 
                  backgroundColor: 'hsla(var(--border) / 0.5)', 
                  borderRadius: '3px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Threshold marker */}
                  <div style={{
                    position: 'absolute',
                    left: `${item.threshold * 100}%`,
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    backgroundColor: 'hsl(var(--text-secondary))',
                    zIndex: 2
                  }} />
                  {/* Score fill */}
                  <div style={{
                    width: `${item.score * 100}%`,
                    height: '100%',
                    backgroundColor: iconColor,
                    borderRadius: '3px',
                    transition: 'width 1s ease-out'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
