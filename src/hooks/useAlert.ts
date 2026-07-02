import { useState, useEffect, useCallback } from 'react';
import { fetchAlert } from '../services/api';
import type { AlertDetail } from '../services/types';

interface UseAlertResult {
  alert: AlertDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAlert(alertId: string | undefined): UseAlertResult {
  const [alert, setAlert] = useState<AlertDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!alertId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchAlert(alertId);
      setAlert(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch alert';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [alertId]);

  useEffect(() => {
    load();
  }, [load]);

  return { alert, loading, error, refresh: load };
}
