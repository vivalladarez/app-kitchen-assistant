import { RecipeCategory, RecipeFestivity } from '../types';

export const categoryLabels: Record<RecipeCategory, string> = {
  bolos: 'Bolos',
  massas: 'Massas',
  carnes: 'Carnes',
  saladas: 'Saladas',
  sobremesas: 'Sobremesas',
  outros: 'Outros',
};

export const festivityLabels: Record<RecipeFestivity, string> = {
  natal: 'Natal',
  aniversario: 'Aniversário',
  'almoco-domingo': 'Almoço de domingo',
  pascoa: 'Páscoa',
  'dia-a-dia': 'Dia a dia',
};

export const prepTimeOptions = [
  { label: 'Qualquer', value: 0 },
  { label: 'Até 30 min', value: 30 },
  { label: 'Até 45 min', value: 45 },
  { label: 'Até 60 min', value: 60 },
];

export type SortOption = 'time' | 'popularity' | 'name';

export const sortLabels: Record<SortOption, string> = {
  time: 'Tempo',
  popularity: 'Popularidade',
  name: 'Nome',
};
