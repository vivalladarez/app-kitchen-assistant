export type KitchenDeviceState = 'idle' | 'preparing' | 'alert';

export type KitchenColorLevel = 'light' | 'golden' | 'dark' | 'burned';

export interface KitchenPanSensor {
  id: 'slider' | 'simulated';
  celsius: number;
  alert: boolean;
}

export interface KitchenColorSensor {
  id: 'tcs3200';
  level: KitchenColorLevel;
  alert: boolean;
}

export interface KitchenSoundSensor {
  id: 'sound';
  level: number;
  alert: boolean;
}

export interface KitchenSensors {
  pan: KitchenPanSensor;
  color: KitchenColorSensor;
  sound: KitchenSoundSensor;
}

/** Nível de som (0–100) acima disso dispara alerta. */
export const SOUND_ALERT_LEVEL = 70;

export const COLOR_ALERT_LEVELS: KitchenColorLevel[] = ['dark', 'burned'];

export interface KitchenStatus {
  online: boolean;
  temperature: number;
  deviceState: KitchenDeviceState;
  sensors: KitchenSensors;
}
