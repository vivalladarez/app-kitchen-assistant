import Constants from 'expo-constants';

import { AppSettings } from '../types';

export const KITCHEN_SERVER_PORT = 8770;

export function getMetroHostIp(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | undefined)?.debuggerHost;

  if (!hostUri) return null;

  const host = hostUri.split(':')[0]?.trim();
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  return host;
}

export function resolveKitchenServerBase(settings: AppSettings): string | null {
  if (!settings.kitchenConnectionEnabled) return null;

  const manual = settings.kitchenServerHost.trim();
  if (manual) {
    if (manual.startsWith('http://') || manual.startsWith('https://')) {
      return manual.replace(/\/$/, '');
    }
    return `http://${manual.replace(/\/$/, '')}:${KITCHEN_SERVER_PORT}`;
  }

  const ip = getMetroHostIp();
  if (!ip) return null;

  return `http://${ip}:${KITCHEN_SERVER_PORT}`;
}
