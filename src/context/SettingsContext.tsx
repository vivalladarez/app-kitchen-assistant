import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { defaultSettings } from '../constants/defaultSettings';
import { resolveKitchenServerBase } from '../constants/kitchenConfig';
import { resolveTtsServerBase } from '../constants/ttsConfig';
import {
  getFontScale,
  getThemeColors,
  getTypography,
  ThemeColors,
} from '../constants/theme';
import { storageService } from '../services/storageService';
import { syncKitchenRuntimeConfig } from '../services/kitchenRuntimeConfig';
import { syncTtsRuntimeConfig } from '../services/ttsRuntimeConfig';
import { AppSettings, UserProfile } from '../types';

interface SettingsContextValue {
  isReady: boolean;
  settings: AppSettings;
  user: UserProfile | null;
  theme: { colors: ThemeColors; isDark: boolean; isHighContrast: boolean };
  typography: ReturnType<typeof getTypography>;
  fontScale: number;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
  updateUser: (user: UserProfile) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [storedSettings, storedUser] = await Promise.all([
          storageService.getSettings(),
          storageService.getUser(),
        ]);
        if (storedSettings) setSettings({ ...defaultSettings, ...storedSettings });
        if (storedUser) setUser(storedUser);
      } finally {
        setIsReady(true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    syncTtsRuntimeConfig(
      settings.remoteTtsEnabled,
      resolveTtsServerBase(settings),
    );
    syncKitchenRuntimeConfig(
      settings.kitchenConnectionEnabled,
      resolveKitchenServerBase(settings),
    );
  }, [settings]);

  const persistSettings = useCallback(async (next: AppSettings) => {
    setSettings(next);
    await storageService.saveSettings(next);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      const next = { ...settings, ...patch };

      if (patch.highContrast === true || patch.theme === 'high-contrast') {
        next.highContrast = true;
        next.theme = 'high-contrast';
      } else if (patch.highContrast === false && next.theme === 'high-contrast') {
        next.theme = 'light';
        next.highContrast = false;
      } else if (patch.theme === 'light' || patch.theme === 'dark') {
        next.highContrast = false;
      }

      persistSettings(next);
    },
    [settings, persistSettings],
  );

  const resetSettings = useCallback(() => {
    persistSettings(defaultSettings);
  }, [persistSettings]);

  const updateUser = useCallback(async (profile: UserProfile) => {
    setUser(profile);
    await storageService.saveUser(profile);
  }, []);

  const theme = useMemo(() => {
    const colors = getThemeColors(settings);
    return {
      colors,
      isDark: settings.theme === 'dark',
      isHighContrast: settings.highContrast || settings.theme === 'high-contrast',
    };
  }, [settings]);

  const typography = useMemo(
    () => getTypography(settings.fontSize),
    [settings.fontSize],
  );

  const fontScale = getFontScale(settings.fontSize);

  const value = useMemo(
    () => ({
      isReady,
      settings,
      user,
      theme,
      typography,
      fontScale,
      updateSettings,
      resetSettings,
      updateUser,
    }),
    [
      isReady,
      settings,
      user,
      theme,
      typography,
      fontScale,
      updateSettings,
      resetSettings,
      updateUser,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings deve ser usado dentro de SettingsProvider');
  }
  return ctx;
}
