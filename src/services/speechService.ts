import * as Speech from 'expo-speech';

export const speechService = {
  speak: (text: string) => Speech.speak(text),
  stop: () => Speech.stop(),
};
