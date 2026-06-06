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
import { categoryLabels, festivityLabels, prepTimeOptions, SortOption, sortLabels } from '../constants/labels';
import { spacing } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { useSettings } from '../context/SettingsContext';
import { RecipeCategory, RecipeFestivity, RootStackParamList } from '../types';
import { filterAndSortRecipes } from '../utils/recipeFilters';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const categories = Object.entries(categoryLabels) as [RecipeCategory, string][];
const festivities = Object.entries(festivityLabels) as [RecipeFestivity, string][];
const sortOptions = Object.entries(sortLabels) as [SortOption, string][];

export function SearchScreen({ navigation }: Props) {
  const { recipes, toggleFavorite } = useRecipes();
  const { theme, typography } = useSettings();
  const { colors } = theme;
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
            fontSize: typography.md,
          },
        ]}
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
        <Text style={[styles.filterLabel, { color: colors.textSecondary, fontSize: typography.sm }]}>Categoria:</Text>
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
        <Text style={[styles.filterLabel, { color: colors.textSecondary, fontSize: typography.sm }]}>Festividade:</Text>
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
        <Text style={[styles.filterLabel, { color: colors.textSecondary, fontSize: typography.sm }]}>Tempo:</Text>
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
        <Text style={[styles.filterLabel, { color: colors.textSecondary, fontSize: typography.sm }]}>Ordenar:</Text>
        {sortOptions.map(([key, label]) => (
          <FilterChip
            key={key}
            label={label}
            selected={sortBy === key}
            onPress={() => setSortBy(key)}
          />
        ))}
      </ScrollView>

      <Text style={[styles.resultCount, { color: colors.textSecondary, fontSize: typography.sm }]}>
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
          <Text style={[styles.empty, { color: colors.textSecondary, fontSize: typography.md }]}>Nenhuma receita encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  resultCount: {
    marginVertical: spacing.sm,
  },
  list: {
    paddingBottom: spacing.lg,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
