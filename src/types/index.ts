export type RecipeCategory =
  | 'bolos'
  | 'massas'
  | 'carnes'
  | 'saladas'
  | 'sobremesas'
  | 'outros';

export type RecipeFestivity =
  | 'natal'
  | 'aniversario'
  | 'almoco-domingo'
  | 'pascoa'
  | 'dia-a-dia';

export type DietaryRestriction =
  | 'diet'
  | 'sem-gluten'
  | 'sem-lactose'
  | 'vegetariano'
  | 'vegano';

export type VoiceProfile =
  | 'jacquin'
  | 'louro-jose'
  | 'paola-carosella'
  | 'palmirinha'
  | 'remy'
  | 'linguini';

export type AppTheme = 'light' | 'dark' | 'high-contrast';

export interface RecipeStep {
  id: string;
  order: number;
  instruction: string;
  recoveryInstruction?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  festivity: RecipeFestivity;
  prepTimeMinutes: number;
  popularity: number;
  ingredients: string[];
  materials: string[];
  steps: RecipeStep[];
  isFavorite?: boolean;
  isCustom?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  dietaryRestrictions: DietaryRestriction[];
}

export interface AppSettings {
  theme: AppTheme;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  voiceProfile: VoiceProfile;
  signLanguageEnabled: boolean;
  dietaryRestrictions: DietaryRestriction[];
  openInDialogMode: boolean;
}

export type VoiceCommand =
  | 'começar receita'
  | 'próximo passo'
  | 'confirma'
  | 'errei'
  | 'repetir'
  | 'adaptar receita'
  | 'temperatura'
  | 'voltar para receita'
  | 'parar receita';

export type RootStackParamList = {
  Home: undefined;
  Favorites: undefined;
  Search: undefined;
  CreateRecipe: { copyFromId?: string } | undefined;
  Recipe: { recipeId: string };
  CheckIngredients: { recipeId: string };
  EditRecipe: { recipeId: string };
  DialogMode: { recipeId: string; stepIndex?: number };
  Settings: undefined;
  Register: undefined;
};
