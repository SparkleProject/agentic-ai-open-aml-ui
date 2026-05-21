import React from 'react';
import { Card } from '../Card/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TimeSeriesMetric } from '../../services/mockObservabilityData';

interface ThroughputChartProps {
  data: TimeSeriesMetric[];
}

export const ThroughputChart: React.FC<ThroughputChartProps> = ({ data }) => {
  return (
    <Card className="glass" title="Agent Throughput" description="Volume of investigations processed by AI agents per hour.">
      <div style={{ width: '100%', height: '300px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              itemStyle={{ color: 'hsl(var(--primary))' }}
            />
            <Area 
              type="monotone" 
              dataKey="throughput" 
              name="Investigations"
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorThroughput)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
