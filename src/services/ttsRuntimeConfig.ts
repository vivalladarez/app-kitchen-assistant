let remoteTtsEnabled = true;
let ttsServerBaseUrl: string | null = null;

export function syncTtsRuntimeConfig(enabled: boolean, baseUrl: string | null) {
  remoteTtsEnabled = enabled;
  ttsServerBaseUrl = baseUrl;
}

export function getTtsRuntimeConfig() {
  return {
    enabled: remoteTtsEnabled,
    baseUrl: ttsServerBaseUrl,
  };
}
