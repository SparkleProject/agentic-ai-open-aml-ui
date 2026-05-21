import React from 'react';
import { Card } from '../Card/Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number; // percentage, positive for up, negative for down
  trendLabel?: string;
  inverseTrendColor?: boolean; // if true, up is red, down is green (e.g. for error rates)
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendLabel, inverseTrendColor = false }) => {
  let trendColor = 'hsl(var(--text-secondary))';
  let TrendIcon = Minus;

  if (trend !== undefined) {
    if (trend > 0) {
      trendColor = inverseTrendColor ? 'hsl(var(--error))' : 'hsl(var(--success))';
      TrendIcon = ArrowUpRight;
    } else if (trend < 0) {
      trendColor = inverseTrendColor ? 'hsl(var(--success))' : 'hsl(var(--error))';
      TrendIcon = ArrowDownRight;
    }
  }

  return (
    <Card className="glass" style={{ padding: '24px' }}>
      <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
        {title}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'hsl(var(--text-primary))' }}>
          {value}
        </h3>
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', color: trendColor, fontSize: '0.875rem', fontWeight: 500 }}>
            <TrendIcon size={16} style={{ marginRight: '4px' }} />
            {Math.abs(trend)}%
            {trendLabel && <span style={{ marginLeft: '6px', color: 'hsl(var(--text-secondary))', fontWeight: 400 }}>{trendLabel}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
