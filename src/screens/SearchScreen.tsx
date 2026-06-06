import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FilterChip, RecipeCard } from '../components';
import {
  categoryLabels,
  festivityLabels,
  prepTimeOptions,
  SortOption,
  sortLabels,
} from '../constants/labels';
import { colors, spacing } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { RecipeCategory, RecipeFestivity, RootStackParamList } from '../types';
import { filterAndSortRecipes } from '../utils/recipeFilters';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const categories = Object.entries(categoryLabels) as [RecipeCategory, string][];
const festivities = Object.entries(festivityLabels) as [RecipeFestivity, string][];
const sortOptions = Object.entries(sortLabels) as [SortOption, string][];

export function SearchScreen({ navigation }: Props) {
  const { recipes, toggleFavorite } = useRecipes();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RecipeCategory | null>(null);
  const [festivity, setFestivity] = useState<RecipeFestivity | null>(null);
  const [maxPrepTime, setMaxPrepTime] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  const filtered = useMemo(
    () =>
      filterAndSortRecipes(recipes, {
        query,
        category,
        festivity,
        maxPrepTime,
        sortBy,
      }),
    [recipes, query, category, festivity, maxPrepTime, sortBy],
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar receitas..."
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel="Campo de busca de receitas"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <Text style={styles.filterLabel}>Categoria:</Text>
        <FilterChip
          label="Todas"
          selected={category === null}
          onPress={() => setCategory(null)}
        />
        {categories.map(([key, label]) => (
          <FilterChip
            key={key}
            label={label}
            selected={category === key}
            onPress={() => setCategory(category === key ? null : key)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <Text style={styles.filterLabel}>Festividade:</Text>
        <FilterChip
          label="Todas"
          selected={festivity === null}
          onPress={() => setFestivity(null)}
        />
        {festivities.map(([key, label]) => (
          <FilterChip
            key={key}
            label={label}
            selected={festivity === key}
            onPress={() => setFestivity(festivity === key ? null : key)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <Text style={styles.filterLabel}>Tempo:</Text>
        {prepTimeOptions.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={maxPrepTime === opt.value}
            onPress={() => setMaxPrepTime(opt.value)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <Text style={styles.filterLabel}>Ordenar:</Text>
        {sortOptions.map(([key, label]) => (
          <FilterChip
            key={key}
            label={label}
            selected={sortBy === key}
            onPress={() => setSortBy(key)}
          />
        ))}
      </ScrollView>

      <Text style={styles.resultCount}>
        {filtered.length}{' '}
        {filtered.length === 1 ? 'receita encontrada' : 'receitas encontradas'}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => navigation.navigate('Recipe', { recipeId: item.id })}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma receita encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  filterRow: {
    maxHeight: 48,
    marginBottom: spacing.xs,
  },
  filterContent: {
    alignItems: 'center',
    paddingRight: spacing.md,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  resultCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginVertical: spacing.sm,
  },
  list: {
    paddingBottom: spacing.lg,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xl,
    fontSize: 16,
  },
});
