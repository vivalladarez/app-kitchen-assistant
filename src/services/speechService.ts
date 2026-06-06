import * as Speech from 'expo-speech';

interface SpeakOptions {
  onDone?: () => void;
  onStopped?: () => void;
}

export const speechService = {
  speak: (text: string, options?: SpeakOptions) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'pt-BR',
      onDone: options?.onDone,
      onStopped: options?.onStopped,
    });
  },
  stop: () => Speech.stop(),
  isSpeaking: () => Speech.isSpeakingAsync(),
};
