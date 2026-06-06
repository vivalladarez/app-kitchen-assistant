import { VoiceCommand } from '../types';

const commandPatterns: { command: VoiceCommand; patterns: string[] }[] = [
  { command: 'começar receita', patterns: ['começar receita', 'comecar receita', 'iniciar receita'] },
  { command: 'próximo passo', patterns: ['próximo passo', 'proximo passo', 'próximo', 'proximo'] },
  { command: 'confirma', patterns: ['confirma', 'confirmar', 'ok', 'sim'] },
  { command: 'errei', patterns: ['errei', 'erro', 'deu errado'] },
  { command: 'repetir', patterns: ['repetir', 'repita', 'de novo'] },
  { command: 'adaptar receita', patterns: ['adaptar receita', 'adaptar', 'pedir adaptação', 'adaptacao'] },
  { command: 'temperatura', patterns: ['temperatura', 'temp', 'panela'] },
  { command: 'voltar para receita', patterns: ['voltar para receita', 'ver receita', 'receita completa'] },
  { command: 'parar receita', patterns: ['parar receita', 'parar', 'cancelar'] },
];

function normalize(text: string) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const voiceRecognitionService = {
  parseCommand: (transcript: string): VoiceCommand | null => {
    const normalized = normalize(transcript);
    for (const { command, patterns } of commandPatterns) {
      if (patterns.some((p) => normalized.includes(normalize(p)))) {
        return command;
      }
    }
    return null;
  },
};
