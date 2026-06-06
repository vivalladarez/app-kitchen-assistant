import {
  ExpoSpeechRecognitionModule,
  type ExpoSpeechRecognitionErrorEvent,
  type ExpoSpeechRecognitionResultEvent,
} from 'expo-speech-recognition';

const LOCALE = 'pt-BR';

export const speechRecognitionService = {
  async isAvailable(): Promise<boolean> {
    try {
      return ExpoSpeechRecognitionModule.isRecognitionAvailable();
    } catch {
      return false;
    }
  },

  async requestPermissions() {
    return ExpoSpeechRecognitionModule.requestPermissionsAsync();
  },

  startListening() {
    ExpoSpeechRecognitionModule.start({
      lang: LOCALE,
      interimResults: true,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: true,
    });
  },

  stopListening() {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {
      // noop
    }
  },

  abortListening() {
    try {
      ExpoSpeechRecognitionModule.abort();
    } catch {
      // noop
    }
  },

  addResultListener(
    handler: (event: ExpoSpeechRecognitionResultEvent) => void,
  ) {
    return ExpoSpeechRecognitionModule.addListener('result', handler);
  },

  addErrorListener(handler: (event: ExpoSpeechRecognitionErrorEvent) => void) {
    return ExpoSpeechRecognitionModule.addListener('error', handler);
  },

  addEndListener(handler: () => void) {
    return ExpoSpeechRecognitionModule.addListener('end', handler);
  },

  addStartListener(handler: () => void) {
    return ExpoSpeechRecognitionModule.addListener('start', handler);
  },
};
