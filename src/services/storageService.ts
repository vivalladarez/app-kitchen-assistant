import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppSettings, Recipe, UserProfile } from '../types';

const KEYS = {
  settings: '@kitchen/settings',
  user: '@kitchen/user',
  recipes: '@kitchen/recipes',
} as const;

export const storageService = {
  async getSettings(): Promise<AppSettings | null> {
    const raw = await AsyncStorage.getItem(KEYS.settings);
    return raw ? (JSON.parse(raw) as AppSettings) : null;
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
  },

  async getUser(): Promise<UserProfile | null> {
    const raw = await AsyncStorage.getItem(KEYS.user);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  },

  async saveUser(user: UserProfile): Promise<void> {
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
  },

  async getRecipes(): Promise<Recipe[] | null> {
    const raw = await AsyncStorage.getItem(KEYS.recipes);
    return raw ? (JSON.parse(raw) as Recipe[]) : null;
  },

  async saveRecipes(recipes: Recipe[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.recipes, JSON.stringify(recipes));
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};
