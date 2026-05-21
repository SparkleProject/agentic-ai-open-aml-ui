export interface TimeSeriesMetric {
  time: string;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  throughput: number;
  errorRate: number;
  averageCostUSD: number;
}

export interface ObservabilitySummary {
  totalProcessed: number;
  activeAgents: number;
  currentErrorRate: number;
  costMonthToDate: number;
}

export interface ObservabilityData {
  metrics: TimeSeriesMetric[];
  summary: ObservabilitySummary;
}

export const fetchObservabilityData = async (): Promise<ObservabilityData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const times = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  
  const metrics: TimeSeriesMetric[] = times.map((time, i) => {
    // Generate some realistic-looking variations
    const baseLatency = 4000;
    const spike = i === 7 ? 8000 : 0; // Spike at 14:00
    
    return {
      time,
      p50LatencyMs: baseLatency + Math.random() * 500,
      p95LatencyMs: baseLatency + 1500 + Math.random() * 1000 + (spike * 0.5),
      p99LatencyMs: baseLatency + 3000 + Math.random() * 2000 + spike,
      throughput: Math.floor(20 + Math.random() * 80 + (i > 8 && i < 18 ? 50 : 0)),
      errorRate: Math.random() * 2 + (i === 7 ? 5 : 0),
      averageCostUSD: 0.12 + (Math.random() * 0.04)
    };
  });

  return {
    metrics,
    summary: {
      totalProcessed: 14592,
      activeAgents: 8,
      currentErrorRate: 1.2,
      costMonthToDate: 1845.20
    }
  };
};
