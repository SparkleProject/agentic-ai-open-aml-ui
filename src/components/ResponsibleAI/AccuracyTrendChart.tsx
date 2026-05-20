import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card } from '../Card/Card';
import type { AccuracyTrendPoint } from '../../services/mockResponsibleAIData';

interface AccuracyTrendChartProps {
  data: AccuracyTrendPoint[];
}

export const AccuracyTrendChart: React.FC<AccuracyTrendChartProps> = ({ data }) => {
  return (
    <Card title="Agent Accuracy Trends (6 Months)" glass>
      <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border) / 0.5)" vertical={false} />
            <XAxis 
              dataKey="month" 
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
              domain={['dataMin - 2', 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsla(var(--bg-elevated) / 0.9)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid hsla(var(--border) / 0.5)',
                borderRadius: '8px',
                color: 'hsl(var(--text-primary))',
                boxShadow: '0 4px 15px hsla(var(--background) / 0.2)'
              }} 
            />
            <ReferenceLine 
              y={90} 
              label={{ position: 'top', value: 'Target (90%)', fill: 'hsl(var(--text-secondary))', fontSize: 12 }} 
              stroke="hsl(var(--warning))" 
              strokeDasharray="3 3" 
            />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              name="Agent Accuracy"
              stroke="hsl(var(--primary))" 
              strokeWidth={3} 
              dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
