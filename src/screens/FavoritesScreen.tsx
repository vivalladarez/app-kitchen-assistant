import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { RecipeCard } from '../components';
import { spacing } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { useSettings } from '../context/SettingsContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const { getFavoriteRecipes, toggleFavorite } = useRecipes();
  const { theme, typography } = useSettings();
  const { colors } = theme;
  const favorites = getFavoriteRecipes();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
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
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text, fontSize: typography.lg }]}>
              Nenhum favorito ainda
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: typography.md }]}>
              Busque receitas e toque na estrela para salvar aqui.
            </Text>
          </View>
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
  list: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
