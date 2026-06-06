import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PrimaryButton, StepCard, VoiceCommandButton } from '../components';
import { dialogVoiceCommands } from '../constants/voiceCommands';
import { colors, spacing } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { useDialogMode } from '../hooks/useDialogMode';
import { speechService } from '../services/speechService';
import { RootStackParamList, VoiceCommand } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DialogMode'>;

export function DialogModeScreen({ navigation, route }: Props) {
  const { getRecipeById } = useRecipes();
  const recipe = getRecipeById(route.params.recipeId);
  const initialStep = route.params.stepIndex ?? 0;

  const {
    stepIndex,
    totalSteps,
    currentStep,
    phase,
    displayText,
    statusMessage,
    progress,
    isSpeaking,
    handleCommand,
  } = useDialogMode(recipe, initialStep);

  const onVoiceCommand = useCallback(
    (command: VoiceCommand) => {
      if (command === 'parar receita') {
        Alert.alert(
          'Parar receita?',
          'Deseja encerrar o modo diálogo?',
          [
            { text: 'Continuar', style: 'cancel' },
            {
              text: 'Parar',
              style: 'destructive',
              onPress: () => {
                speechService.stop();
                navigation.goBack();
              },
            },
          ],
        );
        return;
      }

      const action = handleCommand(command);

      if (action.type === 'stop') {
        speechService.stop();
        navigation.goBack();
      } else if (action.type === 'goRecipe') {
        navigation.navigate('Recipe', { recipeId: route.params.recipeId });
      }
    },
    [handleCommand, navigation, route.params.recipeId],
  );

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Receita não encontrada.</Text>
      </View>
    );
  }

  const isFinished = phase === 'finished';

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.recipeTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StepCard
          step={currentStep}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          displayText={displayText}
          phase={phase}
          isSpeaking={isSpeaking}
        />

        {statusMessage && (
          <View style={styles.statusBanner}>
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>
        )}

        {isFinished ? (
          <View style={styles.finishedActions}>
            <PrimaryButton
              title="Voltar para receita"
              variant="outline"
              onPress={() =>
                navigation.navigate('Recipe', { recipeId: recipe.id })
              }
            />
            <PrimaryButton
              title="Ir para Home"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        ) : (
          <>
            <Text style={styles.commandsTitle}>Comandos simulados</Text>
            <View style={styles.commandsGrid}>
              {dialogVoiceCommands.map((command) => (
                <VoiceCommandButton
                  key={command}
                  command={command}
                  onPress={onVoiceCommand}
                />
              ))}
            </View>
          </>
        )}

        {!isFinished && (
          <PrimaryButton
            title="Ver receita completa"
            variant="outline"
            style={styles.recipeLink}
            onPress={() => navigation.navigate('Recipe', { recipeId: recipe.id })}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  statusBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FFECB5',
  },
  statusText: {
    fontSize: 15,
    color: '#856404',
    fontWeight: '500',
  },
  commandsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  commandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  recipeLink: {
    marginTop: spacing.lg,
  },
  finishedActions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
