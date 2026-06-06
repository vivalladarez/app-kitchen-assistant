import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { mockRecipes } from '../data/mockRecipes';
import { storageService } from '../services/storageService';
import { Recipe } from '../types';
import { useSettings } from './SettingsContext';

interface RecipeContextValue {
  isReady: boolean;
  recipes: Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
  getFavoriteRecipes: () => Recipe[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Recipe;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  copyRecipe: (id: string) => Recipe;
}

const RecipeContext = createContext<RecipeContextValue | null>(null);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const { isReady: settingsReady } = useSettings();
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [isReady, setIsReady] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    if (!settingsReady) return;

    async function load() {
      const stored = await storageService.getRecipes();
      setRecipes(stored ?? mockRecipes);
      setIsReady(true);
    }
    load();
  }, [settingsReady]);

  useEffect(() => {
    if (!isReady || skipSave.current) {
      skipSave.current = false;
      return;
    }
    storageService.saveRecipes(recipes);
  }, [recipes, isReady]);

  const getRecipeById = useCallback(
    (id: string) => recipes.find((r) => r.id === id),
    [recipes],
  );

  const getFavoriteRecipes = useCallback(
    () => recipes.filter((r) => r.isFavorite),
    [recipes],
  );

  const toggleFavorite = useCallback((id: string) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r,
      ),
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => recipes.find((r) => r.id === id)?.isFavorite ?? false,
    [recipes],
  );

  const addRecipe = useCallback((data: Omit<Recipe, 'id'>) => {
    const recipe: Recipe = { ...data, id: generateId(), isCustom: true };
    setRecipes((prev) => [...prev, recipe]);
    return recipe;
  }, []);

  const updateRecipe = useCallback((id: string, data: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data, id } : r)),
    );
  }, []);

  const copyRecipe = useCallback(
    (id: string) => {
      const original = recipes.find((r) => r.id === id);
      if (!original) throw new Error('Receita não encontrada');

      const copy: Recipe = {
        ...original,
        id: generateId(),
        title: `${original.title} (cópia)`,
        isCustom: true,
        isFavorite: false,
        steps: original.steps.map((s) => ({ ...s, id: generateId() })),
      };
      setRecipes((prev) => [...prev, copy]);
      return copy;
    },
    [recipes],
  );

  const value = useMemo(
    () => ({
      isReady,
      recipes,
      getRecipeById,
      getFavoriteRecipes,
      toggleFavorite,
      isFavorite,
      addRecipe,
      updateRecipe,
      copyRecipe,
    }),
    [
      isReady,
      recipes,
      getRecipeById,
      getFavoriteRecipes,
      toggleFavorite,
      isFavorite,
      addRecipe,
      updateRecipe,
      copyRecipe,
    ],
  );

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) {
    throw new Error('useRecipes deve ser usado dentro de RecipeProvider');
  }
  return ctx;
}
