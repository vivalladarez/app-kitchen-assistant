import { AppSettings } from '../types';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  success: string;
  favorite: string;
  header: string;
  headerText: string;
  warningBg: string;
  warningText: string;
  warningBorder: string;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const lightColors: ThemeColors = {
  primary: '#2D6A4F',
  primaryDark: '#1B4332',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  accent: '#E76F51',
  success: '#40916C',
  favorite: '#E63946',
  header: '#2D6A4F',
  headerText: '#FFFFFF',
  warningBg: '#FFF3CD',
  warningText: '#856404',
  warningBorder: '#FFECB5',
};

const darkColors: ThemeColors = {
  primary: '#52B788',
  primaryDark: '#40916C',
  background: '#1A1A2E',
  surface: '#16213E',
  text: '#E9ECEF',
  textSecondary: '#ADB5BD',
  border: '#495057',
  accent: '#F4A261',
  success: '#52B788',
  favorite: '#FF6B6B',
  header: '#1B4332',
  headerText: '#FFFFFF',
  warningBg: '#3D3000',
  warningText: '#FFD966',
  warningBorder: '#665500',
};

const highContrastColors: ThemeColors = {
  primary: '#FFFF00',
  primaryDark: '#FFFF00',
  background: '#000000',
  surface: '#000000',
  text: '#FFFFFF',
  textSecondary: '#FFFFFF',
  border: '#FFFFFF',
  accent: '#FF6600',
  success: '#00FF00',
  favorite: '#FF0000',
  header: '#000000',
  headerText: '#FFFF00',
  warningBg: '#000000',
  warningText: '#FFFF00',
  warningBorder: '#FFFFFF',
};

export function getThemeColors(settings: AppSettings): ThemeColors {
  if (settings.highContrast || settings.theme === 'high-contrast') {
    return highContrastColors;
  }
  if (settings.theme === 'dark') {
    return darkColors;
  }
  return lightColors;
}

export function getFontScale(fontSize: AppSettings['fontSize']): number {
  switch (fontSize) {
    case 'small':
      return 0.85;
    case 'large':
      return 1.25;
    default:
      return 1;
  }
}

export function getTypography(fontSize: AppSettings['fontSize']) {
  const scale = getFontScale(fontSize);
  return {
    scale,
    xs: Math.round(12 * scale),
    sm: Math.round(14 * scale),
    md: Math.round(16 * scale),
    lg: Math.round(20 * scale),
    xl: Math.round(24 * scale),
    xxl: Math.round(28 * scale),
  };
}

/** @deprecated Use useSettings().theme.colors */
export const colors = lightColors;
