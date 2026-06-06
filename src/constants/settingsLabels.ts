import { DietaryRestriction, VoiceProfile } from '../types';

export const dietaryRestrictionLabels: Record<DietaryRestriction, string> = {
  diet: 'Diet',
  'sem-gluten': 'Sem glúten',
  'sem-lactose': 'Sem lactose',
  vegetariano: 'Vegetariano',
  vegano: 'Vegano',
};

export const voiceProfileLabels: Record<VoiceProfile, string> = {
  jacquin: 'Jacquin',
  'louro-jose': 'Louro José',
  'paola-carosella': 'Paola Carosella',
  palmirinha: 'Palmirinha',
  remy: 'Ratatouille — Remy',
  linguini: 'Linguini — Ratatouille',
};

export const themeLabels = {
  light: 'Claro',
  dark: 'Escuro',
  'high-contrast': 'Alto contraste',
} as const;

export const fontSizeLabels = {
  small: 'Pequena',
  medium: 'Média',
  large: 'Grande',
} as const;

export const fontFamilyOptions = ['System', 'Serif', 'Monospace'] as const;
