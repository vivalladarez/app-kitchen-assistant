export type ExpoSpeechRecognitionResultEvent = {
  results: Array<{ transcript: string }>;
  isFinal: boolean;
};

export type ExpoSpeechRecognitionErrorEvent = {
  error: string;
  message?: string;
};

type Subscription = { remove: () => void };

const noopSubscription: Subscription = { remove: () => {} };

export const speechRecognitionService = {
  async isAvailable(): Promise<boolean> {
    return false;
  },

  async requestPermissions() {
    return { granted: false };
  },

  startListening() {},

  stopListening() {},

  abortListening() {},

  addResultListener(_handler: (event: ExpoSpeechRecognitionResultEvent) => void) {
    return noopSubscription;
  },

  addErrorListener(_handler: (event: ExpoSpeechRecognitionErrorEvent) => void) {
    return noopSubscription;
  },

  addEndListener(_handler: () => void) {
    return noopSubscription;
  },

  addStartListener(_handler: () => void) {
    return noopSubscription;
  },
};
