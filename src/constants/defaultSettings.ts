import { AppSettings } from '../types';

export const defaultSettings: AppSettings = {
  theme: 'light',
  highContrast: false,
  fontSize: 'medium',
  fontFamily: 'System',
  voiceProfile: 'palmirinha',
  signLanguageEnabled: false,
  dietaryRestrictions: [],
  openInDialogMode: false,
  remoteTtsEnabled: true,
  ttsServerHost: '',
};
