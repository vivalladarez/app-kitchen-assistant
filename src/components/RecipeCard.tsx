import { Pressable, StyleSheet, Text, View } from 'react-native';

import { categoryLabels, festivityLabels } from '../constants/labels';
import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { Recipe } from '../types';
import { AppIcon } from './AppIcon';

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
  const { theme, typography } = useSettings();
  const { colors } = theme;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: colors.text, fontSize: typography.md + 1 }]}
          numberOfLines={2}
        >
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
            <AppIcon
              name={recipe.isFavorite ? 'star' : 'star-outline'}
              size={22}
              color={colors.favorite}
            />
          </Pressable>
        )}
      </View>
      <Text style={[styles.meta, { color: colors.textSecondary, fontSize: typography.sm }]}>
        {categoryLabels[recipe.category]} · {festivityLabels[recipe.festivity]}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.time, { color: colors.primary, fontSize: typography.sm }]}>
          {recipe.prepTimeMinutes} min
        </Text>
        <View style={styles.popularity}>
          <AppIcon name="star" size={14} color={colors.textSecondary} />
          <Text style={[styles.popularityText, { color: colors.textSecondary, fontSize: typography.sm }]}>
            {recipe.popularity}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  meta: {
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  time: {
    fontWeight: '500',
  },
  popularity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularityText: {
    fontWeight: '500',
  },
});
