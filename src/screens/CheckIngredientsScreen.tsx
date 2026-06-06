import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components';
import { colors, spacing } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckIngredients'>;

interface CheckItem {
  id: string;
  label: string;
  type: 'ingredient' | 'material';
}

export function CheckIngredientsScreen({ route }: Props) {
  const { getRecipeById } = useRecipes();
  const recipe = getRecipeById(route.params.recipeId);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const items = useMemo<CheckItem[]>(() => {
    if (!recipe) return [];
    return [
      ...recipe.ingredients.map((label, i) => ({
        id: `ing-${i}`,
        label,
        type: 'ingredient' as const,
      })),
      ...recipe.materials.map((label, i) => ({
        id: `mat-${i}`,
        label,
        type: 'material' as const,
      })),
    ];
  }, [recipe]);

  const allChecked = items.length > 0 && items.every((item) => checked[item.id]);
  const checkedCount = items.filter((item) => checked[item.id]).length;

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirm = () => {
    Alert.alert(
      'Ingredientes confirmados!',
      'Tudo pronto para iniciar o modo passo a passo. (Disponível na próxima MR)',
      [{ text: 'OK' }],
    );
  };

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Receita não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Confira se você tem tudo antes de começar a preparar "{recipe.title}".
      </Text>

      <Text style={styles.progress}>
        {checkedCount} de {items.length} itens confirmados
      </Text>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.groupTitle}>Ingredientes</Text>
        {items
          .filter((i) => i.type === 'ingredient')
          .map((item) => (
            <CheckRow
              key={item.id}
              label={item.label}
              checked={!!checked[item.id]}
              onToggle={() => toggleItem(item.id)}
            />
          ))}

        <Text style={styles.groupTitle}>Materiais</Text>
        {items
          .filter((i) => i.type === 'material')
          .map((item) => (
            <CheckRow
              key={item.id}
              label={item.label}
              checked={!!checked[item.id]}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
      </ScrollView>

      <PrimaryButton
        title="Confirmar e iniciar preparo"
        disabled={!allChecked}
        onPress={handleConfirm}
        style={styles.confirmButton}
      />
    </View>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={[styles.row, checked && styles.rowChecked]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.rowLabel, checked && styles.rowLabelChecked]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
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
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  progress: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.lg,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowChecked: {
    borderColor: colors.success,
    backgroundColor: '#F0FFF4',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  rowLabelChecked: {
    color: colors.primaryDark,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
