import React from 'react';
import { Card } from '../Card/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { TimeSeriesMetric } from '../../services/mockObservabilityData';

interface LatencyMetricsChartProps {
  data: TimeSeriesMetric[];
}

export const LatencyMetricsChart: React.FC<LatencyMetricsChartProps> = ({ data }) => {
  return (
    <Card className="glass" title="Latency Distribution (ms)" description="P50, P95, and P99 agent response times.">
      <div style={{ width: '100%', height: '300px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border) / 0.5)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--text-secondary))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="hsl(var(--text-secondary))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsla(var(--bg-surface) / 0.95)', 
                borderColor: 'hsla(var(--border))',
                borderRadius: '8px',
                backdropFilter: 'blur(12px)',
                color: 'hsl(var(--text-primary))',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              dataKey="p50LatencyMs" 
              name="P50 (Median)" 
              stroke="hsl(var(--success))" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="p95LatencyMs" 
              name="P95" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="p99LatencyMs" 
              name="P99 (Tail)" 
              stroke="hsl(var(--error))" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
