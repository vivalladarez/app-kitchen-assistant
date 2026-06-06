import { SortOption } from '../constants/labels';
import { Recipe, RecipeCategory, RecipeFestivity } from '../types';

export interface RecipeFilters {
  query: string;
  category: RecipeCategory | null;
  festivity: RecipeFestivity | null;
  maxPrepTime: number;
  sortBy: SortOption;
}

export function filterAndSortRecipes(
  recipes: Recipe[],
  filters: RecipeFilters,
): Recipe[] {
  let result = [...recipes];

  const query = filters.query.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.ingredients.some((i) => i.toLowerCase().includes(query)),
    );
  }

  if (filters.category) {
    result = result.filter((r) => r.category === filters.category);
  }

  if (filters.festivity) {
    result = result.filter((r) => r.festivity === filters.festivity);
  }

  if (filters.maxPrepTime > 0) {
    result = result.filter((r) => r.prepTimeMinutes <= filters.maxPrepTime);
  }

  result.sort((a, b) => {
    switch (filters.sortBy) {
      case 'time':
        return a.prepTimeMinutes - b.prepTimeMinutes;
      case 'popularity':
        return b.popularity - a.popularity;
      case 'name':
        return a.title.localeCompare(b.title, 'pt-BR');
      default:
        return 0;
    }
  });

  return result;
}
