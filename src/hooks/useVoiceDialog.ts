import { useCallback, useEffect, useRef, useState } from 'react';

import { useSettings } from '../context/SettingsContext';
import { speechRecognitionService } from '../services/speechRecognitionService';
import { speechService } from '../services/speechService';
import { voiceRecognitionService } from '../services/voiceRecognitionService';
import { VoiceCommand } from '../types';

const UNKNOWN_COMMAND_MSG =
  'Não entendi. Você pode dizer confirma, próximo passo, errei, repetir, adaptar receita, temperatura ou parar receita.';

interface UseVoiceDialogOptions {
  enabled: boolean;
  isSpeaking: boolean;
  isFinished: boolean;
  onCommand: (command: VoiceCommand) => void;
}

export function useVoiceDialog({
  enabled,
  isSpeaking,
  isFinished,
  onCommand,
}: UseVoiceDialogOptions) {
  const { settings } = useSettings();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const wasSpeakingRef = useRef(false);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    speechRecognitionService.isAvailable().then(setIsAvailable);
  }, []);

  useEffect(() => {
    if (!isAvailable) return;

    const startSub = speechRecognitionService.addStartListener(() => {
      setIsListening(true);
      setVoiceError(null);
    });
    const endSub = speechRecognitionService.addEndListener(() => {
      setIsListening(false);
    });
    const errorSub = speechRecognitionService.addErrorListener((event) => {
      setIsListening(false);
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setVoiceError(event.message ?? 'Erro no reconhecimento de voz.');
      }
    });
    const resultSub = speechRecognitionService.addResultListener((event) => {
      const text = event.results[0]?.transcript ?? '';
      setTranscript(text);

      if (!event.isFinal || processingRef.current || !text.trim()) return;

      processingRef.current = true;
      const command = voiceRecognitionService.parseCommand(text);

      if (command) {
        onCommand(command);
        setTranscript('');
      } else {
        setVoiceError('Comando não reconhecido.');
        speechService.speak(UNKNOWN_COMMAND_MSG, {
          voiceProfile: settings.voiceProfile,
        });
      }

      setTimeout(() => {
        processingRef.current = false;
      }, 1200);
    });

    return () => {
      startSub.remove();
      endSub.remove();
      errorSub.remove();
      resultSub.remove();
    };
  }, [isAvailable, onCommand, settings.voiceProfile]);

  const startListening = useCallback(async () => {
    if (!isAvailable || isSpeaking || isFinished || isListening) return;

    if (!permissionGranted) {
      const result = await speechRecognitionService.requestPermissions();
      if (!result.granted) {
        setVoiceError('Permissão de microfone negada.');
        return;
      }
      setPermissionGranted(true);
    }

    setTranscript('');
    setVoiceError(null);
    speechRecognitionService.startListening();
  }, [isAvailable, isSpeaking, isFinished, isListening, permissionGranted]);

  const stopListening = useCallback(() => {
    speechRecognitionService.stopListening();
    setIsListening(false);
  }, []);

  // Auto-escuta após o assistente terminar de falar
  useEffect(() => {
    if (!enabled || !isAvailable || isFinished) return;

    if (wasSpeakingRef.current && !isSpeaking) {
      listenTimeoutRef.current = setTimeout(() => {
        startListening();
      }, 700);
    }

    if (isSpeaking && isListening) {
      stopListening();
    }

    wasSpeakingRef.current = isSpeaking;

    return () => {
      if (listenTimeoutRef.current) {
        clearTimeout(listenTimeoutRef.current);
      }
    };
  }, [
    enabled,
    isAvailable,
    isFinished,
    isSpeaking,
    isListening,
    startListening,
    stopListening,
  ]);

  useEffect(() => {
    return () => {
      speechRecognitionService.abortListening();
    };
  }, []);

  const assistantState: 'speaking' | 'listening' | 'waiting' = isSpeaking
    ? 'speaking'
    : isListening
      ? 'listening'
      : 'waiting';

  return {
    isAvailable,
    isListening,
    transcript,
    voiceError,
    assistantState,
    startListening,
    stopListening,
  };
}
