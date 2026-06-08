import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Speech from 'expo-speech';

import { buildSpeakUrl } from '../constants/ttsConfig';
import { VoiceProfile } from '../types';
import { getTtsRuntimeConfig } from './ttsRuntimeConfig';

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

let activeSound: Audio.Sound | null = null;
let remotePlaying = false;
let localCallbacks: Pick<SpeakOptions, 'onDone' | 'onStopped'> = {};
let speakRequestId = 0;

async function unloadActiveSound() {
  if (!activeSound) return;

  try {
    await activeSound.stopAsync();
    await activeSound.unloadAsync();
  } catch {
    // noop
  }

  activeSound = null;
  remotePlaying = false;
}

function speakLocal(text: string, options?: SpeakOptions) {
  const profile = options?.voiceProfile ?? 'palmirinha';
  localCallbacks = {
    onDone: options?.onDone,
    onStopped: options?.onStopped,
  };

  Speech.speak(text, {
    language: 'pt-BR',
    rate: voiceRates[profile],
    pitch: voicePitches[profile],
    onDone: () => {
      localCallbacks.onDone?.();
      localCallbacks = {};
    },
    onStopped: () => {
      localCallbacks.onStopped?.();
      localCallbacks = {};
    },
  });
}

async function speakRemote(text: string, options?: SpeakOptions): Promise<boolean> {
  const { enabled, baseUrl } = getTtsRuntimeConfig();
  if (!enabled || !baseUrl) return false;

  const profile = options?.voiceProfile ?? 'palmirinha';
  const uri = buildSpeakUrl(baseUrl, text, profile);
  const requestId = ++speakRequestId;

  try {
    const probe = await fetch(`${baseUrl}/health`, { method: 'GET' });
    if (!probe.ok) return false;
  } catch {
    return false;
  }

  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    await unloadActiveSound();

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
      (status: AVPlaybackStatus) => {
        if (!status.isLoaded || requestId !== speakRequestId) return;

        if (status.didJustFinish) {
          remotePlaying = false;
          options?.onDone?.();
          sound.unloadAsync().catch(() => undefined);
          if (activeSound === sound) activeSound = null;
        }
      },
    );

    activeSound = sound;
    remotePlaying = true;
    return true;
  } catch {
    await unloadActiveSound();
    return false;
  }
}

export const speechService = {
  speak: (text: string, options?: SpeakOptions) => {
    Speech.stop();
    localCallbacks = {};
    void unloadActiveSound();

    void (async () => {
      const usedRemote = await speakRemote(text, options);
      if (!usedRemote) {
        speakLocal(text, options);
      }
    })();
  },

  stop: () => {
    Speech.stop();
    localCallbacks.onStopped?.();
    localCallbacks = {};
    void unloadActiveSound();
  },

  isSpeaking: async () => {
    if (remotePlaying) return true;
    return Speech.isSpeakingAsync();
  },
};
