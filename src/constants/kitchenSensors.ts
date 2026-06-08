import { KitchenColorLevel, SOUND_ALERT_LEVEL } from '../types/kitchen';

export type KitchenSensorId = 'pan' | 'color' | 'sound';

export const KITCHEN_SENSOR_LABELS: Record<KitchenSensorId, string> = {
  pan: 'Panela',
  color: 'Cor',
  sound: 'Som',
};

export const KITCHEN_COLOR_LABELS: Record<KitchenColorLevel, string> = {
  light: 'Claro',
  golden: 'Dourado',
  dark: 'Escuro',
  burned: 'Queimado',
};

export const KITCHEN_HARDWARE_MAP = {
  pan: {
    component: 'Potenciômetro linear (slider)',
    controller: 'Raspberry Pi Pico W (ADC)',
    role: 'Simula temperatura da panela (20–80 °C). Alerta no app se > 40 °C.',
  },
  color: {
    component: 'TCS3200 / TCS230',
    controller: 'BBC Micro:bit V2 (+ adaptador Robocore)',
    role: 'Detecta claro → dourado → escuro. Alerta em escuro/queimado (risco de queima).',
  },
  sound: {
    component: 'Sensor de som',
    controller: 'Raspberry Pi Pico W (ADC)',
    role: `Chiado/estalo na panela. Alerta se nível > ${SOUND_ALERT_LEVEL}%.`,
  },
} as const;
