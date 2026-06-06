import { VoiceCommand } from '../types';

export const voiceCommandLabels: Record<VoiceCommand, string> = {
  'começar receita': 'Começar receita',
  'próximo passo': 'Próximo passo',
  confirma: 'Confirma',
  errei: 'Errei',
  repetir: 'Repetir',
  'adaptar receita': 'Adaptar receita',
  temperatura: 'Temperatura',
  'voltar para receita': 'Voltar p/ receita',
  'parar receita': 'Parar receita',
};

export const dialogVoiceCommands: VoiceCommand[] = [
  'confirma',
  'próximo passo',
  'errei',
  'repetir',
  'adaptar receita',
  'temperatura',
  'parar receita',
];

export const ADAPTATION_MESSAGE =
  'Adaptação sugerida: reduza o fogo pela metade e adicione duas colheres de água para equilibrar o preparo.';

export const RECIPE_COMPLETE_MESSAGE =
  'Parabéns! Você concluiu a receita. Bom apetite!';
