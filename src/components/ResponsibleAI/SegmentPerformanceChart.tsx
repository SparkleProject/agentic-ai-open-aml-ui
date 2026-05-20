import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from '../Card/Card';
import type { SegmentPerformance } from '../../services/mockResponsibleAIData';

interface SegmentPerformanceChartProps {
  data: SegmentPerformance[];
}

export const SegmentPerformanceChart: React.FC<SegmentPerformanceChartProps> = ({ data }) => {
  return (
    <Card title="False Positives / Negatives by Segment" glass>
      <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border) / 0.5)" vertical={false} />
            <XAxis 
              dataKey="segment" 
              stroke="hsl(var(--text-secondary))" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="hsl(var(--text-secondary))" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'hsla(var(--primary) / 0.1)' }}
              contentStyle={{ 
                backgroundColor: 'hsla(var(--bg-elevated) / 0.9)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid hsla(var(--border) / 0.5)',
                borderRadius: '8px',
                color: 'hsl(var(--text-primary))',
                boxShadow: '0 4px 15px hsla(var(--background) / 0.2)'
              }} 
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: 'hsl(var(--text-secondary))' }}
              iconType="circle"
            />
            <Bar 
              dataKey="falsePositives" 
              name="False Positives" 
              fill="hsl(var(--warning))" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
            <Bar 
              dataKey="falseNegatives" 
              name="False Negatives" 
              fill="hsl(var(--error))" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
