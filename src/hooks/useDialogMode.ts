import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ADAPTATION_MESSAGE,
  RECIPE_COMPLETE_MESSAGE,
} from '../constants/voiceCommands';
import { useSettings } from '../context/SettingsContext';
import { connectedKitchenService } from '../services/connectedKitchenService';
import { speechService } from '../services/speechService';
import { Recipe, RecipeStep, VoiceCommand } from '../types';

export type DialogPhase = 'step' | 'recovery' | 'adaptation' | 'finished';

export type DialogAction =
  | { type: 'stop' }
  | { type: 'goRecipe' }
  | { type: 'none' };

interface UseDialogModeResult {
  stepIndex: number;
  totalSteps: number;
  currentStep: RecipeStep | undefined;
  phase: DialogPhase;
  displayText: string;
  statusMessage: string | null;
  progress: number;
  isSpeaking: boolean;
  handleCommand: (command: VoiceCommand) => DialogAction;
  speakCurrent: () => void;
}

function sortSteps(steps: RecipeStep[]) {
  return [...steps].sort((a, b) => a.order - b.order);
}

export function useDialogMode(
  recipe: Recipe | undefined,
  initialStepIndex = 0,
): UseDialogModeResult {
  const { settings } = useSettings();
  const steps = useMemo(
    () => (recipe ? sortSteps(recipe.steps) : []),
    [recipe],
  );

  const [stepIndex, setStepIndex] = useState(initialStepIndex);
  const [phase, setPhase] = useState<DialogPhase>('step');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const spokenRef = useRef<string | null>(null);

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;

  const displayText = useMemo(() => {
    if (phase === 'finished') return RECIPE_COMPLETE_MESSAGE;
    if (phase === 'adaptation') return ADAPTATION_MESSAGE;
    if (phase === 'recovery' && currentStep?.recoveryInstruction) {
      return currentStep.recoveryInstruction;
    }
    return currentStep?.instruction ?? '';
  }, [phase, currentStep]);

  const progress =
    phase === 'finished'
      ? 1
      : totalSteps > 0
        ? (stepIndex + (phase === 'recovery' ? 0.5 : 0)) / totalSteps
        : 0;

  const speakCurrent = useCallback(() => {
    if (!displayText) return;
    setIsSpeaking(true);
    speechService.speak(displayText, {
      voiceProfile: settings.voiceProfile,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  }, [displayText, settings.voiceProfile]);

  useEffect(() => {
    if (!displayText) return;

    const key = `${phase}-${stepIndex}-${displayText}`;
    if (spokenRef.current === key) return;

    spokenRef.current = key;
    speakCurrent();

    return () => {
      speechService.stop();
    };
  }, [displayText, phase, stepIndex, speakCurrent]);

  const advanceStep = useCallback(() => {
    setStatusMessage(null);
    if (stepIndex >= steps.length - 1) {
      setPhase('finished');
      return;
    }
    setStepIndex((i) => i + 1);
    setPhase('step');
  }, [stepIndex, steps.length]);

  const handleCommand = useCallback(
    (command: VoiceCommand): DialogAction => {
      if (phase === 'finished') {
        if (command === 'parar receita') return { type: 'stop' };
        if (command === 'voltar para receita') return { type: 'goRecipe' };
        return { type: 'none' };
      }

      switch (command) {
        case 'confirma':
          if (phase === 'recovery' || phase === 'adaptation') {
            setPhase('step');
            setStatusMessage(null);
            return { type: 'none' };
          }
          advanceStep();
          return { type: 'none' };

        case 'próximo passo':
          if (phase === 'recovery' || phase === 'adaptation') {
            setPhase('step');
          }
          advanceStep();
          return { type: 'none' };

        case 'errei':
          if (currentStep?.recoveryInstruction) {
            setPhase('recovery');
            setStatusMessage('Modo recuperação ativado');
          } else {
            const msg = 'Não há instrução de recuperação para este passo.';
            setStatusMessage(msg);
            speechService.speak(msg, { voiceProfile: settings.voiceProfile });
          }
          return { type: 'none' };

        case 'repetir':
          spokenRef.current = null;
          speakCurrent();
          return { type: 'none' };

        case 'adaptar receita':
          setPhase('adaptation');
          setStatusMessage('Sugestão de adaptação');
          return { type: 'none' };

        case 'temperatura': {
          void connectedKitchenService.fetchStatus().then((kitchenStatus) => {
            if (!kitchenStatus.online) {
              const offlineMsg =
                'Cozinha offline. Exibindo temperatura simulada da panela.';
              setStatusMessage(offlineMsg);
              speechService.speak(offlineMsg, {
                voiceProfile: settings.voiceProfile,
              });
              return;
            }

            const alert = connectedKitchenService.checkPanTemperature();
            const temp = connectedKitchenService.getTemperature();
            const msg = `${alert} (${temp}°C)`;
            setStatusMessage(msg);
            speechService.speak(alert, { voiceProfile: settings.voiceProfile });
          });
          return { type: 'none' };
        }

        case 'voltar para receita':
          return { type: 'goRecipe' };

        case 'parar receita':
          return { type: 'stop' };

        default:
          return { type: 'none' };
      }
    },
    [phase, currentStep, advanceStep, speakCurrent, settings.voiceProfile],
  );

  return {
    stepIndex,
    totalSteps,
    currentStep,
    phase,
    displayText,
    statusMessage,
    progress,
    isSpeaking,
    handleCommand,
    speakCurrent,
  };
}
