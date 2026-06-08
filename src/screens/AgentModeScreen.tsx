import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  AgentChecklistItem,
  AgentOrbButton,
  AgentRecipeBubble,
  AgentSuggestionChip,
  KitchenStatusBadge,
  KitchenSensorStrip,
  SessionStatusBadge,
} from '../components';
import {
  dialogVoiceCommands,
  voiceCommandLabels,
} from '../constants/voiceCommands';
import { spacing } from '../constants/theme';
import { useDialogMode } from '../hooks/useDialogMode';
import { useKitchenConnection } from '../hooks/useKitchenConnection';
import { useVoiceDialog } from '../hooks/useVoiceDialog';
import { useRecipes } from '../context/RecipeContext';
import { useSettings } from '../context/SettingsContext';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { speechService } from '../services/speechService';
import { voiceRecognitionService } from '../services/voiceRecognitionService';
import { Recipe, RootStackParamList, VoiceCommand } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AgentMode'>;

type AgentPhase = 'idle' | 'checking' | 'cooking' | 'finished';

const VOICE_SUGGESTIONS = [
  'Surpreenda-me',
  'Algo rápido',
  'Receita favorita',
  'Bolo de cenoura',
];

const ASSISTANT_GREETING =
  'Diga o que quer cozinhar ou toque em uma sugestão para começarmos.';

interface CheckItem {
  id: string;
  label: string;
}

export function AgentModeScreen({ navigation }: Props) {
  const { user, settings, theme, typography } = useSettings();
  const { colors } = theme;
  const kitchen = useKitchenConnection(settings.kitchenConnectionEnabled);
  const { recipes, getRecipeById, getFavoriteRecipes } = useRecipes();

  const [phase, setPhase] = useState<AgentPhase>('idle');
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isIdleListening, setIsIdleListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [statusLine, setStatusLine] = useState(ASSISTANT_GREETING);
  const idleListenerCleanup = useRef<(() => void) | null>(null);

  const activeRecipe = activeRecipeId ? getRecipeById(activeRecipeId) : undefined;
  const dialogRecipe =
    phase === 'cooking' || phase === 'finished' ? activeRecipe : undefined;

  const {
    stepIndex,
    totalSteps,
    phase: dialogPhase,
    displayText,
    statusMessage,
    progress,
    isSpeaking,
    handleCommand,
  } = useDialogMode(dialogRecipe, 0);

  const resetSession = useCallback(() => {
    speechService.stop();
    speechRecognitionService.abortListening();
    idleListenerCleanup.current?.();
    idleListenerCleanup.current = null;
    setIsIdleListening(false);
    setPhase('idle');
    setActiveRecipeId(null);
    setChecked({});
    setStatusLine(ASSISTANT_GREETING);
  }, []);

  const onCookingCommand = useCallback(
    (command: VoiceCommand) => {
      if (command === 'parar receita') {
        Alert.alert('Encerrar preparo?', 'Deseja sair do modo agente?', [
          { text: 'Continuar', style: 'cancel' },
          { text: 'Encerrar', style: 'destructive', onPress: resetSession },
        ]);
        return;
      }

      const action = handleCommand(command);
      if (action.type === 'stop') {
        resetSession();
      } else if (action.type === 'goRecipe' && activeRecipeId) {
        navigation.navigate('Recipe', { recipeId: activeRecipeId });
      }
    },
    [activeRecipeId, handleCommand, navigation, resetSession],
  );

  const voiceDialog = useVoiceDialog({
    enabled: phase === 'cooking' && dialogPhase !== 'finished',
    isSpeaking,
    isFinished: dialogPhase === 'finished',
    onCommand: onCookingCommand,
  });

  useEffect(() => {
    speechRecognitionService.isAvailable().then(setVoiceAvailable);
  }, []);

  useEffect(() => {
    if (phase === 'cooking' && dialogPhase === 'finished') {
      setPhase('finished');
    }
  }, [phase, dialogPhase]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (phase === 'idle') return;

      event.preventDefault();
      Alert.alert('Sair do assistente?', 'Seu progresso nesta sessão será perdido.', [
        { text: 'Continuar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            resetSession();
            navigation.dispatch(event.data.action);
          },
        },
      ]);
    });

    return unsubscribe;
  }, [navigation, phase, resetSession]);

  useEffect(() => {
    return () => {
      speechRecognitionService.abortListening();
      speechService.stop();
      idleListenerCleanup.current?.();
    };
  }, []);

  const checkItems = useMemo<CheckItem[]>(() => {
    if (!activeRecipe) return [];
    return [
      ...activeRecipe.ingredients.map((label, i) => ({
        id: `ing-${i}`,
        label,
      })),
      ...activeRecipe.materials.map((label, i) => ({
        id: `mat-${i}`,
        label,
      })),
    ];
  }, [activeRecipe]);

  const allChecked =
    checkItems.length > 0 && checkItems.every((item) => checked[item.id]);
  const checkedCount = checkItems.filter((item) => checked[item.id]).length;

  const suggestedRecipes = useMemo(() => {
    const favorites = getFavoriteRecipes();
    if (favorites.length > 0) {
      return favorites.slice(0, 4);
    }
    return [...recipes]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
  }, [getFavoriteRecipes, recipes]);

  const beginRecipe = useCallback((recipe: Recipe) => {
    speechService.stop();
    setActiveRecipeId(recipe.id);
    setChecked({});
    setPhase('checking');
    setStatusLine(
      `Antes de ${recipe.title}, confira se você tem todos os ingredientes e materiais.`,
    );
  }, []);

  const confirmIngredients = useCallback(() => {
    if (!allChecked) {
      setStatusLine('Marque todos os itens da lista antes de confirmar.');
      speechService.speak('Confira todos os itens antes de começar.', {
        voiceProfile: settings.voiceProfile,
      });
      return;
    }
    setPhase('cooking');
  }, [allChecked, settings.voiceProfile]);

  const pickSurprise = useCallback(() => {
    const pool = getFavoriteRecipes().length > 0 ? getFavoriteRecipes() : recipes;
    const recipe = pool[Math.floor(Math.random() * pool.length)];
    if (recipe) beginRecipe(recipe);
  }, [beginRecipe, getFavoriteRecipes, recipes]);

  const pickQuick = useCallback(() => {
    const recipe = [...recipes].sort(
      (a, b) => a.prepTimeMinutes - b.prepTimeMinutes,
    )[0];
    if (recipe) beginRecipe(recipe);
  }, [beginRecipe, recipes]);

  const pickFavorite = useCallback(() => {
    const favorites = getFavoriteRecipes();
    if (favorites.length === 0) {
      setStatusLine('Você ainda não tem favoritos. Escolha uma sugestão abaixo.');
      return;
    }
    beginRecipe(favorites[0]);
  }, [beginRecipe, getFavoriteRecipes]);

  const pickCarrotCake = useCallback(() => {
    const recipe =
      recipes.find((r) => r.title.toLowerCase().includes('cenoura')) ?? recipes[0];
    if (recipe) beginRecipe(recipe);
  }, [beginRecipe, recipes]);

  const handleSuggestion = useCallback(
    (label: string) => {
      if (phase === 'checking' && label === 'Confirma') {
        confirmIngredients();
        return;
      }
      if (phase !== 'idle') return;

      switch (label) {
        case 'Surpreenda-me':
          pickSurprise();
          break;
        case 'Algo rápido':
          pickQuick();
          break;
        case 'Receita favorita':
          pickFavorite();
          break;
        case 'Bolo de cenoura':
          pickCarrotCake();
          break;
        default:
          break;
      }
    },
    [confirmIngredients, phase, pickCarrotCake, pickFavorite, pickQuick, pickSurprise],
  );

  const handleIdleVoiceResult = useCallback(
    (transcript: string) => {
      const normalized = transcript.toLowerCase();
      const recipeMatch = recipes.find((r) =>
        normalized.includes(r.title.toLowerCase().slice(0, 8)),
      );

      if (recipeMatch) {
        beginRecipe(recipeMatch);
        return;
      }

      if (normalized.includes('rapido') || normalized.includes('rápido')) {
        pickQuick();
        return;
      }
      if (normalized.includes('favorit')) {
        pickFavorite();
        return;
      }
      if (normalized.includes('cenoura') || normalized.includes('bolo')) {
        pickCarrotCake();
        return;
      }
      if (normalized.includes('surpreend')) {
        pickSurprise();
        return;
      }

      setStatusLine('Não entendi. Toque em uma sugestão ou diga o nome de uma receita.');
      speechService.speak(
        'Não entendi. Toque em uma sugestão ou diga o nome de uma receita.',
        { voiceProfile: settings.voiceProfile },
      );
    },
    [
      beginRecipe,
      pickCarrotCake,
      pickFavorite,
      pickQuick,
      pickSurprise,
      recipes,
      settings.voiceProfile,
    ],
  );

  const stopIdleListening = useCallback(() => {
    speechRecognitionService.stopListening();
    idleListenerCleanup.current?.();
    idleListenerCleanup.current = null;
    setIsIdleListening(false);
  }, []);

  const startIdleListening = useCallback(
    async (onResult: (text: string) => void) => {
      if (!voiceAvailable) {
        setStatusLine('Voz indisponível. Use as sugestões na tela.');
        return;
      }

      const permission = await speechRecognitionService.requestPermissions();
      if (!permission.granted) {
        setStatusLine('Permissão de microfone negada.');
        return;
      }

      setIsIdleListening(true);

      const resultSub = speechRecognitionService.addResultListener((event) => {
        const text = event.results[0]?.transcript ?? '';
        if (!event.isFinal || !text.trim()) return;
        stopIdleListening();
        onResult(text);
      });

      const endSub = speechRecognitionService.addEndListener(() => {
        setIsIdleListening(false);
      });

      idleListenerCleanup.current = () => {
        resultSub.remove();
        endSub.remove();
      };

      speechRecognitionService.startListening();
    },
    [stopIdleListening, voiceAvailable],
  );

  const handleOrbPress = useCallback(() => {
    if (phase === 'idle') {
      if (isIdleListening) {
        stopIdleListening();
        return;
      }
      setStatusLine('Estou ouvindo... diga o que quer cozinhar.');
      startIdleListening(handleIdleVoiceResult);
      return;
    }

    if (phase === 'checking') {
      if (isIdleListening) {
        stopIdleListening();
        return;
      }
      setStatusLine('Diga confirma quando tiver tudo pronto.');
      startIdleListening((text) => {
        const command = voiceRecognitionService.parseCommand(text);
        if (command === 'confirma') {
          confirmIngredients();
        } else {
          setStatusLine('Diga confirma para iniciar o preparo.');
        }
      });
      return;
    }

    if (phase === 'cooking') {
      if (voiceDialog.isListening) {
        voiceDialog.stopListening();
      } else {
        voiceDialog.startListening();
      }
    }
  }, [
    confirmIngredients,
    handleIdleVoiceResult,
    isIdleListening,
    phase,
    startIdleListening,
    stopIdleListening,
    voiceDialog,
  ]);

  const sessionStatus =
    phase === 'checking'
      ? 'Conferindo ingredientes'
      : phase === 'cooking'
        ? dialogPhase === 'recovery'
          ? 'Recuperação'
          : dialogPhase === 'adaptation'
            ? 'Adaptação'
            : 'Em preparo'
        : phase === 'finished'
          ? 'Receita concluída'
          : '';

  const bubbleText =
    phase === 'idle'
      ? user && statusLine === ASSISTANT_GREETING
        ? `Olá, ${user.name.split(' ')[0]}! ${statusLine}`
        : statusLine
      : phase === 'checking'
        ? statusLine
        : displayText;

  const orbListening =
    phase === 'cooking' ? voiceDialog.isListening : isIdleListening;

  const orbHint =
    phase === 'checking'
      ? allChecked
        ? 'Diga confirma ou toque abaixo'
        : 'Marque os itens abaixo'
      : phase === 'cooking'
        ? voiceDialog.isListening
          ? 'Ouvindo comando...'
          : voiceAvailable
            ? 'Comandos de voz'
            : 'Use os comandos abaixo'
        : phase === 'finished'
          ? 'Preparo finalizado'
          : undefined;

  const sessionProgress =
    phase === 'checking'
      ? checkItems.length > 0
        ? checkedCount / checkItems.length
        : 0
      : progress;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusRow}>
          <KitchenStatusBadge
            online={kitchen.online}
            isChecking={kitchen.isChecking}
          />
          {sessionStatus ? (
            <SessionStatusBadge
              label={sessionStatus}
              tone={
                phase === 'finished'
                  ? 'accent'
                  : phase === 'cooking'
                    ? 'success'
                    : 'default'
              }
            />
          ) : null}
        </View>

        {settings.kitchenConnectionEnabled && !kitchen.isChecking && !kitchen.online && (
          <Text
            style={[
              styles.offlineHint,
              { color: colors.textSecondary, fontSize: typography.xs },
            ]}
          >
            Embarcados offline — temperatura e sensores em modo simulado.
          </Text>
        )}

        {kitchen.online && !kitchen.isChecking && (
          <KitchenSensorStrip sensors={kitchen.sensors} />
        )}

        {activeRecipe && phase !== 'idle' && (
          <View style={styles.recipeHeader}>
            <Text
              style={[styles.recipeTitle, { color: colors.text, fontSize: typography.sm }]}
              numberOfLines={1}
            >
              {activeRecipe.title}
            </Text>
            {phase === 'cooking' && totalSteps > 0 && (
              <Text
                style={[
                  styles.stepMeta,
                  { color: colors.textSecondary, fontSize: typography.xs },
                ]}
              >
                Passo {Math.min(stepIndex + 1, totalSteps)} de {totalSteps}
              </Text>
            )}
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(sessionProgress * 100, 100)}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[styles.messageLabel, { color: colors.primary, fontSize: typography.xs }]}
          >
            Assistente
          </Text>
          <Text
            style={[styles.messageText, { color: colors.text, fontSize: typography.md }]}
          >
            {bubbleText}
          </Text>
        </View>

        {(statusMessage || voiceDialog.voiceError) && phase === 'cooking' && (
          <Text
            style={[
              styles.inlineAlert,
              { color: colors.warningText, fontSize: typography.sm },
            ]}
          >
            {statusMessage ?? voiceDialog.voiceError}
          </Text>
        )}

        {voiceDialog.transcript && phase === 'cooking' && (
          <Text
            style={[
              styles.transcript,
              { color: colors.textSecondary, fontSize: typography.sm },
            ]}
          >
            "{voiceDialog.transcript}"
          </Text>
        )}

        {phase !== 'finished' && (
          <AgentOrbButton
            isListening={orbListening}
            isAvailable={voiceAvailable}
            onPress={handleOrbPress}
            hint={orbHint}
          />
        )}

        {phase === 'idle' && (
          <>
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textSecondary, fontSize: typography.xs },
              ]}
            >
              Experimente dizer
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {VOICE_SUGGESTIONS.map((label) => (
                <AgentSuggestionChip
                  key={label}
                  label={label}
                  onPress={() => handleSuggestion(label)}
                />
              ))}
            </ScrollView>

            {suggestedRecipes.length > 0 && (
              <>
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: colors.textSecondary, fontSize: typography.xs },
                  ]}
                >
                  {getFavoriteRecipes().length > 0 ? 'Seus favoritos' : 'Sugestões para você'}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recipesRow}
                >
                  {suggestedRecipes.map((recipe) => (
                    <AgentRecipeBubble
                      key={recipe.id}
                      title={recipe.title}
                      prepTimeMinutes={recipe.prepTimeMinutes}
                      isFavorite={recipe.isFavorite}
                      onPress={() => beginRecipe(recipe)}
                    />
                  ))}
                </ScrollView>
              </>
            )}

            <Pressable
              accessibilityRole="link"
              onPress={() => navigation.navigate('Search')}
              style={styles.catalogLink}
            >
              <Text
                style={[
                  styles.catalogText,
                  { color: colors.textSecondary, fontSize: typography.sm },
                ]}
              >
                Explorar catálogo completo →
              </Text>
            </Pressable>
          </>
        )}

        {phase === 'checking' && (
          <>
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textSecondary, fontSize: typography.xs },
              ]}
            >
              {checkedCount} de {checkItems.length} confirmados
            </Text>
            {checkItems.map((item) => (
              <AgentChecklistItem
                key={item.id}
                label={item.label}
                checked={!!checked[item.id]}
                onToggle={() =>
                  setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                }
              />
            ))}
            <View style={styles.actionRow}>
              <AgentSuggestionChip
                label="Marcar todos"
                onPress={() => {
                  const next: Record<string, boolean> = {};
                  checkItems.forEach((item) => {
                    next[item.id] = true;
                  });
                  setChecked(next);
                }}
              />
              <AgentSuggestionChip
                label="Confirma"
                onPress={() => handleSuggestion('Confirma')}
              />
            </View>
          </>
        )}

        {(phase === 'cooking' || phase === 'finished') && (
          <>
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textSecondary, fontSize: typography.xs },
              ]}
            >
              {phase === 'finished' ? 'Próximo passo' : 'Comandos de voz'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {phase === 'finished' ? (
                <>
                  <AgentSuggestionChip
                    label="Nova sessão"
                    onPress={resetSession}
                  />
                  <AgentSuggestionChip
                    label="Ver receita"
                    onPress={() =>
                      activeRecipeId &&
                      navigation.navigate('Recipe', { recipeId: activeRecipeId })
                    }
                  />
                  <AgentSuggestionChip
                    label="Ir para Home"
                    onPress={() => {
                      resetSession();
                      navigation.navigate('Home');
                    }}
                  />
                </>
              ) : (
                dialogVoiceCommands.map((command) => (
                  <AgentSuggestionChip
                    key={command}
                    label={voiceCommandLabels[command]}
                    onPress={() => onCookingCommand(command)}
                  />
                ))
              )}
            </ScrollView>
          </>
        )}

        {phase !== 'idle' && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              Alert.alert('Encerrar sessão?', undefined, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Encerrar', style: 'destructive', onPress: resetSession },
              ]);
            }}
            style={styles.endLink}
          >
            <Text
              style={[
                styles.catalogText,
                { color: colors.textSecondary, fontSize: typography.sm },
              ]}
            >
              Encerrar sessão
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'stretch',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  offlineHint: {
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  recipeHeader: {
    marginBottom: spacing.md,
  },
  recipeTitle: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  stepMeta: {
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  messageBubble: {
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  messageLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  messageText: {
    lineHeight: 24,
  },
  inlineAlert: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  transcript: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipsRow: {
    paddingRight: spacing.lg,
  },
  recipesRow: {
    paddingRight: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  catalogLink: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
  },
  endLink: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  catalogText: {
    fontWeight: '500',
  },
});
