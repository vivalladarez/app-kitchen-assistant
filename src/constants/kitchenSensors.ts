import { KitchenColorLevel, SOUND_ALERT_LEVEL } from '../types/kitchen';

export type KitchenSensorId = 'pan' | 'color' | 'sound';

/** Controlador único — todos os sensores no Raspberry Pi Pico W. */
export const KITCHEN_CONTROLLER = 'Raspberry Pi Pico W';

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

/** Pinagem sugerida na protoboard (firmware MicroPython / C++). */
export const PICO_W_PIN_MAP = {
  pan: { pin: 'GP26 (ADC0)', type: 'ADC' as const },
  sound: { pin: 'GP27 (ADC1)', type: 'ADC' as const },
  color: {
    pin: 'GPIO (S0, S1, S2, S3 + OUT)',
    type: 'digital' as const,
  },
} as const;

export const KITCHEN_HARDWARE_MAP = {
  pan: {
    component: 'Potenciômetro linear (slider)',
    controller: KITCHEN_CONTROLLER,
    pin: PICO_W_PIN_MAP.pan.pin,
    role: 'Simula temperatura da panela (20–80 °C). Alerta no app se > 40 °C.',
  },
  color: {
    component: 'TCS3200 / TCS230',
    controller: KITCHEN_CONTROLLER,
    pin: PICO_W_PIN_MAP.color.pin,
    role: 'Detecta claro → dourado → escuro. Alerta em escuro/queimado (risco de queima).',
  },
  sound: {
    component: 'Sensor de som',
    controller: KITCHEN_CONTROLLER,
    pin: PICO_W_PIN_MAP.sound.pin,
    role: `Chiado/estalo na panela. Alerta se nível > ${SOUND_ALERT_LEVEL}%.`,
  },
} as const;
