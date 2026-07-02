import { useState, useEffect, useCallback } from 'react';
import { fetchAlerts } from '../services/api';
import type { Alert } from '../services/types';

interface UseAlertsOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

interface UseAlertsResult {
  alerts: Alert[];
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAlerts(options?: UseAlertsOptions): UseAlertsResult {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAlerts(options);
      setAlerts(response.alerts);
      setTotal(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch alerts';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [options?.status, options?.limit, options?.offset]);

  useEffect(() => {
    load();
  }, [load]);

  return { alerts, total, loading, error, refresh: load };
}
