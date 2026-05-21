# Architectural Implementation Plan: FE-502 (Observability Dashboard)

## 1. Executive Overview & Technical Strategy

**Task**: Build a real-time Observability Dashboard tracking agent throughput, latency (P50/P95/P99), error rates, cost per investigation, and model performance trends.

**Architectural Philosophy**:
Production-grade LLM agents require intense observability. We need to measure not just traditional system metrics (latency/errors), but AI-specific metrics like "cost per investigation" and "model throughput." This dashboard will act as the operations center (Phase 5) for monitoring the health and economics of the AML agents.

---

## 2. Component Architecture

```text
src/
├── services/
│   └── mockObservabilityData.ts          # Generates mock time-series data for metrics
├── components/
│   └── Observability/
│       ├── ThroughputChart.tsx           # Area chart showing alerts processed over time
│       ├── LatencyMetricsChart.tsx       # Line chart showing P50, P95, P99 latencies
│       └── StatCard.tsx                  # Reusable component for top-level KPIs
├── pages/
│   └── ObservabilityDashboard.tsx        # Layout grid assembling the charts and cards
```

---

## 3. Data & State Model

We will build a mock service that returns structured time-series data:

```typescript
export interface TimeSeriesMetric {
  timestamp: string;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  throughput: number; // requests/investigations processed
  errorRate: number; // percentage
  averageCostUSD: number;
}

export interface ObservabilitySummary {
  totalProcessed: number;
  activeAgents: number;
  currentErrorRate: number;
  costMonthToDate: number;
}
```

---

## 4. Step-by-Step Implementation

### Step 1: Data Service (`mockObservabilityData.ts`)
- Create a mock data generator producing a 24-hour time series of metrics (latency, throughput, cost).
- Include summary statistics for the top-level KPI cards.

### Step 2: Charts and Components
- **`StatCard.tsx`**: A simple, highly visual card displaying a KPI value (e.g. `$0.42`), a label ("Avg Cost per Investigation"), and a trend indicator (e.g. "↓ 5% this week" in green).
- **`LatencyMetricsChart.tsx`**: Use `recharts` to build a LineChart plotting P50, P95, and P99 latency against time. P99 should be visually distinct (e.g. red/warning color) to highlight tail latency spikes.
- **`ThroughputChart.tsx`**: Use `recharts` to build a stacked AreaChart showing the volume of alerts processed by different agents (e.g. Sanctions Agent vs. SAR Agent).

### Step 3: Page Assembly (`ObservabilityDashboard.tsx`)
- Build the main dashboard layout using CSS Grid.
- **Top Row**: 4 `StatCard` components summarizing current health (Active Agents, Throughput, Avg Latency, Total Cost).
- **Middle Row**: The `ThroughputChart` (full width) to show volume over time.
- **Bottom Row**: The `LatencyMetricsChart` alongside a smaller module for "Recent Errors".

### Step 4: Routing & Integration
- Register `/observability` in `App.tsx`.
- Add an "Observability" or "System Health" navigation link to the sidebar in `AppLayout.tsx`.

---

## 5. UI/UX Design System Mapping

| Concern | Approach |
|---|---|
| **Data Density** | Dashboards require high density. We will use a clean, dark-mode friendly palette with distinct colors for different metric lines (e.g., P99 = red, P95 = yellow, P50 = green) so analysts can spot anomalies instantly. |
| **Tooltips** | Recharts tooltips will be styled consistently with our `glass` UI theme to provide exact values on hover without obscuring the trendlines. |
