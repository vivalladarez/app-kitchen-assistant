# Cozinha Assistiva

Aplicativo mobile em React Native (Expo) que atua como assistente inteligente de receitas por voz para ambientes de cozinha conectada — projeto de IHM.

## Stack

- React Native + Expo
- TypeScript
- React Navigation
- AsyncStorage (persistência local)
- expo-speech (Text-to-Speech)

## Estrutura de pastas

```
app-kitchen-assistant/
├── App.tsx                 # Entry point
├── assets/                 # Ícones e imagens
└── src/
    ├── components/         # Componentes reutilizáveis
    ├── constants/          # Valores padrão (settings, etc.)
    ├── data/               # Dados mockados
    ├── hooks/              # Hooks customizados
    ├── navigation/         # React Navigation
    ├── screens/            # Telas do app
    ├── services/           # TTS, voz, cozinha conectada
    └── types/              # Tipagens TypeScript
```

## Como rodar

```bash
npm install
npm start
```

Use o Expo Go no celular ou um emulador Android/iOS.

## Status

Este repositório contém apenas a **estrutura inicial** do projeto. As telas, componentes e fluxos serão implementados em MRs incrementais.
