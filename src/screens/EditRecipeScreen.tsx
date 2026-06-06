import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ListInput, PrimaryButton } from '../components';
import {
  categoryLabels,
  festivityLabels,
} from '../constants/labels';
import { colors, spacing } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import {
  RecipeCategory,
  RecipeFestivity,
  RecipeStep,
  RootStackParamList,
} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditRecipe'>;

function generateStepId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export function EditRecipeScreen({ navigation, route }: Props) {
  const { getRecipeById, updateRecipe } = useRecipes();
  const recipe = getRecipeById(route.params.recipeId);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('outros');
  const [festivity, setFestivity] = useState<RecipeFestivity>('dia-a-dia');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('30');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [materials, setMaterials] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);

  useEffect(() => {
    if (!recipe) return;
    setTitle(recipe.title);
    setCategory(recipe.category);
    setFestivity(recipe.festivity);
    setPrepTimeMinutes(String(recipe.prepTimeMinutes));
    setIngredients(recipe.ingredients.length ? recipe.ingredients : ['']);
    setMaterials(recipe.materials.length ? recipe.materials : ['']);
    setSteps(
      recipe.steps.length
        ? recipe.steps.sort((a, b) => a.order - b.order).map((s) => s.instruction)
        : [''],
    );
  }, [recipe]);

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Receita não encontrada.</Text>
      </View>
    );
  }

  const handleSave = () => {
    const prepTime = parseInt(prepTimeMinutes, 10) || 30;
    const recipeSteps: RecipeStep[] = steps
      .filter((s) => s.trim())
      .map((instruction, index) => ({
        id: recipe.steps[index]?.id ?? generateStepId(),
        order: index + 1,
        instruction: instruction.trim(),
        recoveryInstruction: recipe.steps[index]?.recoveryInstruction,
      }));

    updateRecipe(recipe.id, {
      title: title.trim() || 'Receita sem título',
      category,
      festivity,
      prepTimeMinutes: prepTime,
      ingredients: ingredients.filter((i) => i.trim()),
      materials: materials.filter((m) => m.trim()),
      steps: recipeSteps,
    });

    Alert.alert('Salvo!', 'Receita atualizada com sucesso.', [
      { text: 'OK', onPress: () => navigation.navigate('Recipe', { recipeId: recipe.id }) },
    ]);
  };

  const handleShare = async () => {
    const text = [
      title,
      '',
      'Ingredientes:',
      ...ingredients.filter(Boolean).map((i) => `- ${i}`),
      '',
      'Materiais:',
      ...materials.filter(Boolean).map((m) => `- ${m}`),
      '',
      'Passos:',
      ...steps.filter(Boolean).map((s, i) => `${i + 1}. ${s}`),
    ].join('\n');

    await Share.share({ message: text, title: title || 'Receita' });
  };

  const updateStep = (index: number, value: string) => {
    const next = [...steps];
    next[index] = value;
    setSteps(next);
  };

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Nome da receita"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.chipRow}>
        {(Object.entries(categoryLabels) as [RecipeCategory, string][]).map(
          ([key, label]) => (
            <PrimaryButton
              key={key}
              title={label}
              variant={category === key ? 'primary' : 'outline'}
              style={styles.chipButton}
              onPress={() => setCategory(key)}
            />
          ),
        )}
      </View>

      <Text style={styles.label}>Festividade</Text>
      <View style={styles.chipRow}>
        {(Object.entries(festivityLabels) as [RecipeFestivity, string][]).map(
          ([key, label]) => (
            <PrimaryButton
              key={key}
              title={label}
              variant={festivity === key ? 'primary' : 'outline'}
              style={styles.chipButton}
              onPress={() => setFestivity(key)}
            />
          ),
        )}
      </View>

      <Text style={styles.label}>Tempo de preparo (min)</Text>
      <TextInput
        style={styles.input}
        value={prepTimeMinutes}
        onChangeText={setPrepTimeMinutes}
        keyboardType="number-pad"
        placeholder="30"
        placeholderTextColor={colors.textSecondary}
      />

      <ListInput
        label="Ingredientes"
        items={ingredients}
        onChange={setIngredients}
        placeholder="Ingrediente"
      />

      <ListInput
        label="Materiais"
        items={materials}
        onChange={setMaterials}
        placeholder="Utensílio"
      />

      <View style={styles.stepsHeader}>
        <Text style={styles.label}>Passos</Text>
        <PrimaryButton title="+ Passo" variant="outline" style={styles.addStep} onPress={addStep} />
      </View>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <Text style={styles.stepNum}>{index + 1}.</Text>
          <TextInput
            style={[styles.input, styles.stepInput]}
            value={step}
            onChangeText={(text) => updateStep(index, text)}
            placeholder={`Passo ${index + 1}`}
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          {steps.length > 1 && (
            <PrimaryButton
              title="✕"
              variant="secondary"
              style={styles.removeStep}
              onPress={() => removeStep(index)}
            />
          )}
        </View>
      ))}

      <View style={styles.actions}>
        <PrimaryButton title="Salvar edição" onPress={handleSave} />
        <PrimaryButton title="Compartilhar" variant="outline" onPress={handleShare} />
      </View>
    </ScrollView>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addStep: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  stepNum: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
    width: 24,
  },
  stepInput: {
    flex: 1,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  removeStep: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minHeight: 36,
    minWidth: 36,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
