import Constants from 'expo-constants';

import { AppSettings } from '../types';

export const TTS_SERVER_PORT = 8765;

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

export function resolveTtsServerBase(settings: AppSettings): string | null {
  if (!settings.remoteTtsEnabled) return null;

  const manual = settings.ttsServerHost.trim();
  if (manual) {
    if (manual.startsWith('http://') || manual.startsWith('https://')) {
      return manual.replace(/\/$/, '');
    }
    return `http://${manual.replace(/\/$/, '')}:${TTS_SERVER_PORT}`;
  }

  const ip = getMetroHostIp();
  if (!ip) return null;

  return `http://${ip}:${TTS_SERVER_PORT}`;
}

export function buildSpeakUrl(
  baseUrl: string,
  text: string,
  voiceProfile: string,
): string {
  const params = new URLSearchParams({
    text,
    voice: voiceProfile,
  });
  return `${baseUrl}/speak?${params.toString()}`;
}
