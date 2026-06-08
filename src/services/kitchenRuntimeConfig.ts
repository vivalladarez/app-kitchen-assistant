let kitchenConnectionEnabled = true;
let kitchenServerBaseUrl: string | null = null;

export function syncKitchenRuntimeConfig(enabled: boolean, baseUrl: string | null) {
  kitchenConnectionEnabled = enabled;
  kitchenServerBaseUrl = baseUrl;
}

export function getKitchenRuntimeConfig() {
  return {
    enabled: kitchenConnectionEnabled,
    baseUrl: kitchenServerBaseUrl,
  };
}
