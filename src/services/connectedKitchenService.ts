const MOCK_PAN_TEMPERATURE = 52;

const MOCK_AVAILABLE_INGREDIENTS = [
  'Ovos',
  'Farinha de trigo',
  'Açúcar',
  'Cenoura',
  'Óleo',
  'Sal',
  'Alho',
  'Cebola',
  'Frango',
  'Tomate',
];

export const connectedKitchenService = {
  getTemperature: (): number => MOCK_PAN_TEMPERATURE,

  checkPanTemperature: (): string => {
    const temp = MOCK_PAN_TEMPERATURE;
    if (temp > 40) {
      return 'Cuidado, a panela está quente.';
    }
    return `Temperatura da panela: ${temp}°C. Tudo certo para continuar.`;
  },

  getAvailableIngredients: (): string[] => [...MOCK_AVAILABLE_INGREDIENTS],
};
