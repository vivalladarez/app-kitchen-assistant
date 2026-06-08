import { useCallback, useEffect, useState } from 'react';

import {
  connectedKitchenService,
  KitchenStatus,
} from '../services/connectedKitchenService';

const POLL_INTERVAL_MS = 5000;

export function useKitchenConnection(enabled = true) {
  const [status, setStatus] = useState<KitchenStatus>(() =>
    connectedKitchenService.getDefaultStatus(),
  );
  const [isChecking, setIsChecking] = useState(true);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setStatus(connectedKitchenService.getDefaultStatus());
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const next = await connectedKitchenService.fetchStatus();
    setStatus(next);
    setIsChecking(false);
  }, [enabled]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    ...status,
    isChecking,
    refresh,
  };
}
