import { Pressable, StyleSheet, Text, View } from 'react-native';

import { categoryLabels, festivityLabels } from '../constants/labels';
import { colors, spacing } from '../constants/theme';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onToggleFavorite?: () => void;
  showFavorite?: boolean;
}

export function RecipeCard({
  recipe,
  onPress,
  onToggleFavorite,
  showFavorite = true,
}: RecipeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        {showFavorite && onToggleFavorite && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              recipe.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
            }
            hitSlop={8}
            onPress={onToggleFavorite}
          >
            <Text style={styles.favoriteIcon}>{recipe.isFavorite ? '★' : '☆'}</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.meta}>
        {categoryLabels[recipe.category]} · {festivityLabels[recipe.festivity]}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.time}>{recipe.prepTimeMinutes} min</Text>
        <Text style={styles.popularity}>★ {recipe.popularity}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: '#F1F3F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  favoriteIcon: {
    fontSize: 22,
    color: colors.favorite,
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  popularity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
