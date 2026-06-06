import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  PrimaryButton,
  StepCard,
  VoiceCommandButton,
  VoiceDialogPanel,
} from '../components';
import { dialogVoiceCommands } from '../constants/voiceCommands';
import { spacing } from '../constants/theme';
import { useRecipes } from '../context/RecipeContext';
import { useSettings } from '../context/SettingsContext';
import { useDialogMode } from '../hooks/useDialogMode';
import { useVoiceDialog } from '../hooks/useVoiceDialog';
import { speechService } from '../services/speechService';
import { RootStackParamList, VoiceCommand } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DialogMode'>;

export function DialogModeScreen({ navigation, route }: Props) {
  const { getRecipeById } = useRecipes();
  const { theme, typography } = useSettings();
  const { colors } = theme;
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

  const isFinished = phase === 'finished';

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

  const {
    isAvailable: voiceAvailable,
    isListening,
    transcript,
    voiceError,
    assistantState,
    startListening,
    stopListening,
  } = useVoiceDialog({
    enabled: !isFinished,
    isSpeaking,
    isFinished,
    onCommand: onVoiceCommand,
  });

  if (!recipe) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.textSecondary, fontSize: typography.md }]}>
          Receita não encontrada.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.recipeTitle, { color: colors.text, fontSize: typography.md }]} numberOfLines={1}>
          {recipe.title}
        </Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
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
          <View
            style={[
              styles.statusBanner,
              {
                backgroundColor: colors.warningBg,
                borderColor: colors.warningBorder,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.warningText, fontSize: typography.md }]}>
              {statusMessage}
            </Text>
          </View>
        )}

        {!isFinished && (
          <VoiceDialogPanel
            isAvailable={voiceAvailable}
            assistantState={assistantState}
            transcript={transcript}
            voiceError={voiceError}
            onMicPress={isListening ? stopListening : startListening}
          />
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
            <Text style={[styles.commandsTitle, { color: colors.textSecondary, fontSize: typography.sm }]}>
              {voiceAvailable ? 'Alternativa: toque nos comandos' : 'Comandos simulados'}
            </Text>
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
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {},
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  recipeTitle: {
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  statusBanner: {
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '500',
  },
  commandsTitle: {
    fontWeight: '600',
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
