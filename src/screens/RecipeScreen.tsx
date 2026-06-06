import { ReactNode } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components';
import { categoryLabels, festivityLabels } from '../constants/labels';
import { colors, spacing } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Recipe'>;

export function RecipeScreen({ navigation, route }: Props) {
  const { getRecipeById, toggleFavorite, copyRecipe } = useRecipes();
  const recipe = getRecipeById(route.params.recipeId);

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Receita não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <PrimaryButton
          title={recipe.isFavorite ? '★ Favorito' : '☆ Favoritar'}
          variant="outline"
          style={styles.favButton}
          onPress={() => toggleFavorite(recipe.id)}
        />
      </View>

      <Text style={styles.meta}>
        {categoryLabels[recipe.category]} · {festivityLabels[recipe.festivity]} ·{' '}
        {recipe.prepTimeMinutes} min · ★ {recipe.popularity}
      </Text>

      <Section title="Ingredientes">
        {recipe.ingredients.map((item, i) => (
          <Bullet key={i} text={item} />
        ))}
      </Section>

      <Section title="Materiais">
        {recipe.materials.map((item, i) => (
          <Bullet key={i} text={item} />
        ))}
      </Section>

      <Section title="Modo de preparo">
        {recipe.steps
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <View key={step.id} style={styles.step}>
              <Text style={styles.stepNumber}>Passo {step.order}</Text>
              <Text style={styles.stepText}>{step.instruction}</Text>
            </View>
          ))}
      </Section>

      <View style={styles.actions}>
        <PrimaryButton
          title="Conferir ingredientes e materiais"
          onPress={() =>
            navigation.navigate('CheckIngredients', { recipeId: recipe.id })
          }
        />
        <PrimaryButton
          title="Copiar e editar receita"
          variant="outline"
          onPress={() => {
            const copy = copyRecipe(recipe.id);
            navigation.navigate('EditRecipe', { recipeId: copy.id });
          }}
        />
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  favButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
    paddingRight: spacing.md,
  },
  bullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: spacing.sm,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  step: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  stepText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
