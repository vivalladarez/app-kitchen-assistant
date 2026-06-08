import type {
  ExpoSpeechRecognitionErrorEvent,
  ExpoSpeechRecognitionResultEvent,
} from './speechRecognitionService.stub';

const LOCALE = 'pt-BR';

type Subscription = { remove: () => void };

type SpeechModule = {
  isRecognitionAvailable: () => boolean;
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  start: (options: object) => void;
  stop: () => void;
  abort: () => void;
  addListener: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => Subscription;
};

let cachedModule: SpeechModule | null | undefined;

function getModule(): SpeechModule | null {
  if (cachedModule !== undefined) {
    return cachedModule;
  }

  try {
    const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
    cachedModule = ExpoSpeechRecognitionModule as SpeechModule;
  } catch {
    cachedModule = null;
  }

  return cachedModule;
}

const noopSubscription: Subscription = { remove: () => {} };

export const speechRecognitionService = {
  async isAvailable(): Promise<boolean> {
    try {
      const module = getModule();
      return module ? module.isRecognitionAvailable() : false;
    } catch {
      return false;
    }
  },

  async requestPermissions() {
    const module = getModule();
    if (!module) {
      return { granted: false };
    }

    return module.requestPermissionsAsync();
  },

  startListening() {
    const module = getModule();
    if (!module) return;

    module.start({
      lang: LOCALE,
      interimResults: true,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: true,
    });
  },

  stopListening() {
    try {
      getModule()?.stop();
    } catch {
      // noop
    }
  },

  abortListening() {
    try {
      getModule()?.abort();
    } catch {
      // noop
    }
  },

  addResultListener(handler: (event: ExpoSpeechRecognitionResultEvent) => void) {
    const module = getModule();
    if (!module) return noopSubscription;

    return module.addListener('result', handler as (...args: unknown[]) => void);
  },

  addErrorListener(handler: (event: ExpoSpeechRecognitionErrorEvent) => void) {
    const module = getModule();
    if (!module) return noopSubscription;

    return module.addListener('error', handler as (...args: unknown[]) => void);
  },

  addEndListener(handler: () => void) {
    const module = getModule();
    if (!module) return noopSubscription;

    return module.addListener('end', handler as (...args: unknown[]) => void);
  },

  addStartListener(handler: () => void) {
    const module = getModule();
    if (!module) return noopSubscription;

    return module.addListener('start', handler as (...args: unknown[]) => void);
  },
};
