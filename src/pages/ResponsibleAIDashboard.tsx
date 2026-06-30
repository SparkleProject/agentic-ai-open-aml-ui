import React, { useState, useEffect } from 'react';
import { fetchResponsibleAIData } from '../services/api';
import type { AccuracyTrendPoint, BiasMetric, SegmentPerformance } from '../services/mockResponsibleAIData';
import { AccuracyTrendChart } from '../components/ResponsibleAI/AccuracyTrendChart';
import { BiasMetricsCard } from '../components/ResponsibleAI/BiasMetricsCard';
import { SegmentPerformanceChart } from '../components/ResponsibleAI/SegmentPerformanceChart';
import { ShieldCheck } from 'lucide-react';

export const ResponsibleAIDashboard: React.FC = () => {
  const [accuracyData, setAccuracyData] = useState<AccuracyTrendPoint[]>([]);
  const [biasData, setBiasData] = useState<BiasMetric[]>([]);
  const [segmentData, setSegmentData] = useState<SegmentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponsibleAIData().then(data => {
      setAccuracyData(data.accuracyTrends);
      setBiasData(data.biasMetrics);
      setSegmentData(data.segmentPerformance);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading Responsible AI metrics...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'hsla(var(--primary-transparent))' }}>
          <ShieldCheck size={28} color="hsl(var(--primary))" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
            Responsible AI Dashboard
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
            Monitor agent model accuracy, fairness metrics, and segment performance.
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px' 
      }}>
        {/* Top Row */}
        <div style={{ gridColumn: 'span 2' }}>
          <AccuracyTrendChart data={accuracyData} />
        </div>

        {/* Bottom Row */}
        <div>
          <BiasMetricsCard metrics={biasData} />
        </div>
        <div>
          <SegmentPerformanceChart data={segmentData} />
        </div>
      </div>
    </div>
  );
};
