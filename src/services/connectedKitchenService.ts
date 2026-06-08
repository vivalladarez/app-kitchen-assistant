import { getKitchenRuntimeConfig } from './kitchenRuntimeConfig';
import {
  COLOR_ALERT_LEVELS,
  KitchenColorLevel,
  KitchenDeviceState,
  KitchenSensors,
  SOUND_ALERT_LEVEL,
  type KitchenStatus,
} from '../types/kitchen';
import { KITCHEN_COLOR_LABELS } from '../constants/kitchenSensors';

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

export type { KitchenDeviceState, KitchenSensors, KitchenStatus };

function parseColorLevel(value: unknown): KitchenColorLevel {
  if (
    value === 'light' ||
    value === 'golden' ||
    value === 'dark' ||
    value === 'burned'
  ) {
    return value;
  }
  return 'golden';
}

function buildMockSensors(panCelsius: number): KitchenSensors {
  return {
    pan: {
      id: 'simulated',
      celsius: panCelsius,
      alert: panCelsius > 40,
    },
    color: {
      id: 'tcs3200',
      level: 'golden',
      alert: false,
    },
    sound: {
      id: 'sound',
      level: 25,
      alert: false,
    },
  };
}

function parseSensors(
  data: Record<string, unknown>,
  panCelsius: number,
): KitchenSensors {
  const sensors = data.sensors as Record<string, Record<string, unknown>> | undefined;

  if (!sensors) {
    return buildMockSensors(panCelsius);
  }

  const pan = sensors.pan ?? {};
  const color = sensors.color ?? {};
  const sound = sensors.sound ?? {};

  const panTemp = typeof pan.celsius === 'number' ? pan.celsius : panCelsius;
  const colorLevel = parseColorLevel(color.level);
  const soundLevel =
    typeof sound.level === 'number'
      ? Math.min(100, Math.max(0, Math.round(sound.level)))
      : 25;

  return {
    pan: {
      id: pan.id === 'slider' ? 'slider' : 'simulated',
      celsius: panTemp,
      alert: typeof pan.alert === 'boolean' ? pan.alert : panTemp > 40,
    },
    color: {
      id: 'tcs3200',
      level: colorLevel,
      alert:
        typeof color.alert === 'boolean'
          ? color.alert
          : COLOR_ALERT_LEVELS.includes(colorLevel),
    },
    sound: {
      id: 'sound',
      level: soundLevel,
      alert:
        typeof sound.alert === 'boolean'
          ? sound.alert
          : soundLevel >= SOUND_ALERT_LEVEL,
    },
  };
}

function resolveDeviceState(
  sensors: KitchenSensors,
  state: unknown,
): KitchenDeviceState {
  const hasAlert =
    sensors.pan.alert || sensors.color.alert || sensors.sound.alert;

  if (hasAlert || state === 'alert') {
    return 'alert';
  }

  if (state === 'preparing') {
    return 'preparing';
  }

  return 'idle';
}

let cachedStatus: KitchenStatus = {
  online: false,
  temperature: MOCK_PAN_TEMPERATURE,
  deviceState: 'idle',
  sensors: buildMockSensors(MOCK_PAN_TEMPERATURE),
};

export const connectedKitchenService = {
  getDefaultStatus: (): KitchenStatus => ({
    online: false,
    temperature: MOCK_PAN_TEMPERATURE,
    deviceState: 'idle',
    sensors: buildMockSensors(MOCK_PAN_TEMPERATURE),
  }),

  async fetchStatus(): Promise<KitchenStatus> {
    const { enabled, baseUrl } = getKitchenRuntimeConfig();

    if (!enabled || !baseUrl) {
      const offline = {
        online: false,
        temperature: cachedStatus.temperature,
        deviceState: cachedStatus.deviceState,
        sensors: buildMockSensors(cachedStatus.temperature),
      };
      cachedStatus = offline;
      return offline;
    }

    try {
      const response = await fetch(`${baseUrl}/status`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        return { ...cachedStatus, online: false };
      }

      const data = (await response.json()) as Record<string, unknown>;

      const temperature =
        typeof data.temperature === 'number'
          ? data.temperature
          : cachedStatus.temperature;

      const sensors = parseSensors(data, temperature);

      const next: KitchenStatus = {
        online: data.online !== false,
        temperature,
        deviceState: resolveDeviceState(sensors, data.state),
        sensors,
      };

      cachedStatus = next;
      return next;
    } catch {
      return { ...cachedStatus, online: false };
    }
  },

  getStatus: (): KitchenStatus => cachedStatus,

  getTemperature: (): number => cachedStatus.temperature,

  checkPanTemperature: (): string => {
    const { pan, color, sound } = cachedStatus.sensors;
    const temp = pan.celsius;

    if (color.alert || color.level === 'burned') {
      return 'Atenção, a superfície está escurecendo — risco de queimar!';
    }

    if (sound.alert) {
      return 'Som intenso na panela — verifique se não está queimando.';
    }

    if (pan.alert || temp > 40) {
      return 'Cuidado, a panela está quente.';
    }

    return `Panela ${temp}°C. Cor ${KITCHEN_COLOR_LABELS[color.level].toLowerCase()}, som ${sound.level}%.`;
  },

  getAvailableIngredients: (): string[] => [...MOCK_AVAILABLE_INGREDIENTS],
};
