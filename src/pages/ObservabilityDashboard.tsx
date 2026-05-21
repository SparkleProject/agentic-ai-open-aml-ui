import React, { useState, useEffect } from 'react';
import { fetchObservabilityData, type ObservabilityData } from '../services/mockObservabilityData';
import { StatCard } from '../components/Observability/StatCard';
import { ThroughputChart } from '../components/Observability/ThroughputChart';
import { LatencyMetricsChart } from '../components/Observability/LatencyMetricsChart';
import { Activity } from 'lucide-react';

export const ObservabilityDashboard: React.FC = () => {
  const [data, setData] = useState<ObservabilityData | null>(null);

  useEffect(() => {
    fetchObservabilityData().then(setData);
  }, []);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="animate-enter" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: 'hsla(var(--primary-transparent))' }}>
          <Activity size={28} color="hsl(var(--primary))" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
            Observability & Telemetry
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>
            Monitor real-time agent health, economic limits, and tail latencies.
          </p>
        </div>
      </div>

      {/* Top row: KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '24px'
      }}>
        <StatCard 
          title="Total Processed" 
          value={data.summary.totalProcessed.toLocaleString()} 
          trend={12.5} 
          trendLabel="vs last week" 
        />
        <StatCard 
          title="Active Agents" 
          value={data.summary.activeAgents} 
        />
        <StatCard 
          title="Error Rate" 
          value={`${data.summary.currentErrorRate}%`} 
          trend={-0.3} 
          trendLabel="vs last week"
          inverseTrendColor={true}
        />
        <StatCard 
          title="Cost MTD" 
          value={`$${data.summary.costMonthToDate.toLocaleString()}`} 
          trend={4.2} 
          trendLabel="vs last month"
          inverseTrendColor={true}
        />
      </div>

      {/* Charts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '24px' 
      }}>
        <ThroughputChart data={data.metrics} />
        <LatencyMetricsChart data={data.metrics} />
      </div>
    </div>
  );
};
