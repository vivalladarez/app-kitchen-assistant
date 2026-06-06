// Serviço mockado da cozinha conectada

export const connectedKitchenService = {
  getTemperature: (): number => 25,
  checkPanTemperature: (): string | null => null,
  getAvailableIngredients: (): string[] => [],
};
