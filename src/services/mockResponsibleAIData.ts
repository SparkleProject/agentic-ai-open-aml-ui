export interface AccuracyTrendPoint {
  month: string;
  accuracy: number;
  target: number;
}

export interface BiasMetric {
  metric: string;
  score: number;
  threshold: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
  description: string;
}

export interface SegmentPerformance {
  segment: string;
  falsePositives: number;
  falseNegatives: number;
  totalAlerts: number;
}

export const mockAccuracyTrends: AccuracyTrendPoint[] = [
  { month: 'Jan', accuracy: 88, target: 90 },
  { month: 'Feb', accuracy: 89, target: 90 },
  { month: 'Mar', accuracy: 91, target: 90 },
  { month: 'Apr', accuracy: 92, target: 90 },
  { month: 'May', accuracy: 93, target: 90 },
  { month: 'Jun', accuracy: 94, target: 90 },
];

export const mockBiasMetrics: BiasMetric[] = [
  {
    metric: 'Demographic Parity',
    score: 0.96,
    threshold: 0.80,
    status: 'PASS',
    description: 'Measures whether different demographic groups receive positive outcomes at equal rates.'
  },
  {
    metric: 'Equal Opportunity',
    score: 0.85,
    threshold: 0.80,
    status: 'PASS',
    description: 'Measures whether the true positive rates are equal across different demographic groups.'
  },
  {
    metric: 'Predictive Equality',
    score: 0.78,
    threshold: 0.80,
    status: 'WARNING',
    description: 'Measures whether the false positive rates are equal across demographic groups.'
  }
];

export const mockSegmentPerformance: SegmentPerformance[] = [
  { segment: 'Real Estate', falsePositives: 145, falseNegatives: 12, totalAlerts: 1200 },
  { segment: 'Legal Services', falsePositives: 89, falseNegatives: 8, totalAlerts: 850 },
  { segment: 'Accounting', falsePositives: 112, falseNegatives: 5, totalAlerts: 940 },
  { segment: 'Fintech', falsePositives: 210, falseNegatives: 15, totalAlerts: 1800 },
  { segment: 'Retail', falsePositives: 45, falseNegatives: 2, totalAlerts: 400 },
];

export const fetchResponsibleAIData = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    accuracyTrends: mockAccuracyTrends,
    biasMetrics: mockBiasMetrics,
    segmentPerformance: mockSegmentPerformance,
  };
};
