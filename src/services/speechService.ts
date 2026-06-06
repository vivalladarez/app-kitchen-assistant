import * as Speech from 'expo-speech';

import { VoiceProfile } from '../types';

interface SpeakOptions {
  onDone?: () => void;
  onStopped?: () => void;
  voiceProfile?: VoiceProfile;
}

const voiceRates: Record<VoiceProfile, number> = {
  jacquin: 0.9,
  'louro-jose': 1.15,
  'paola-carosella': 1.0,
  palmirinha: 0.85,
  remy: 1.1,
  linguini: 1.05,
};

const voicePitches: Record<VoiceProfile, number> = {
  jacquin: 0.9,
  'louro-jose': 0.8,
  'paola-carosella': 1.1,
  palmirinha: 1.2,
  remy: 1.3,
  linguini: 1.0,
};

export const speechService = {
  speak: (text: string, options?: SpeakOptions) => {
    Speech.stop();
    const profile = options?.voiceProfile ?? 'palmirinha';
    Speech.speak(text, {
      language: 'pt-BR',
      rate: voiceRates[profile],
      pitch: voicePitches[profile],
      onDone: options?.onDone,
      onStopped: options?.onStopped,
    });
  },
  stop: () => Speech.stop(),
  isSpeaking: () => Speech.isSpeakingAsync(),
};
