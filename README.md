# Cozinha Assistiva

Aplicativo mobile em React Native (Expo) que atua como assistente inteligente de receitas por voz para ambientes de cozinha conectada — projeto de IHM.

## Stack

- React Native + Expo (SDK 52)
- TypeScript
- React Navigation
- AsyncStorage (persistência local)
- expo-speech (Text-to-Speech)
- expo-av (mídia de apoio em vídeo)

## Estrutura de pastas

```
app-kitchen-assistant/
├── App.tsx
├── assets/
└── src/
    ├── components/       # UI reutilizável (botões, cards, chips)
    ├── constants/        # Tema, labels, configurações padrão
    ├── context/          # RecipeContext, SettingsContext
    ├── data/             # Receitas mockadas iniciais
    ├── hooks/            # useSettings, useRecipes, useDialogMode
    ├── navigation/       # React Navigation
    ├── screens/          # Telas do app
    ├── services/         # TTS, voz, cozinha conectada, AsyncStorage
    ├── types/            # Tipagens TypeScript
    └── utils/            # Filtros e helpers
```

## Como rodar

```bash
npm install
npm start
```

Escaneie o QR code com **Expo Go** (Android/iOS) ou pressione `a` (Android) / `i` (iOS) no terminal.

Verificação de tipos:

```bash
npm run lint
```

## Funcionalidades

| Área | Descrição |
|------|-----------|
| **Buscar receitas** | Busca, filtros (categoria, festividade, tempo) e ordenação |
| **Favoritos** | Receitas salvas com ★ (persistidas) |
| **CRUD visual** | Criar, editar, copiar e compartilhar receitas |
| **Modo diálogo** | Execução passo a passo com TTS |
| **Comandos simulados** | Botões simulam voz: confirma, errei, repetir, etc. |
| **Recuperação de erro** | Instruções de recovery por passo |
| **Cozinha conectada** | Alerta mockado de panela quente (52°C) |
| **Configurações** | Tema, alto contraste, fonte, vozes, restrições |
| **Cadastro** | Nome, e-mail e preferências alimentares |
| **Persistência** | Favoritos, receitas e configurações sobrevivem ao fechar o app |

## Demo ponta a ponta — Bolo de Cenoura

Siga este roteiro para testar o fluxo completo:

### 1. Cadastro (opcional)

1. Abra o app → **Cadastro**
2. Preencha nome e e-mail
3. Selecione preferências alimentares (ex.: Sem lactose)
4. **Salvar cadastro**

### 2. Configurações (opcional)

1. **Configurações** → escolha **Tema Escuro** ou **Alto contraste**
2. Aumente o **Tamanho da fonte** para Grande
3. Escolha uma **Voz** (ex.: Palmirinha)
4. Volte à Home — o visual deve refletir as mudanças

### 3. Buscar e favoritar

1. **Buscar receitas** → filtre por **Bolos** ou busque "cenoura"
2. Abra **Bolo de Cenoura com Cobertura**
3. Toque em **☆ Favoritar**
4. Feche e reabra o app → o favorito permanece

### 4. Conferir ingredientes

1. Na tela da receita → **Conferir ingredientes e materiais**
2. Marque todos os itens da checklist
3. **Confirmar e iniciar preparo**

### 5. Modo diálogo com voz

1. Ouça o TTS ler o **Passo 1** (pré-aquecer forno)
2. Toque **Confirma** para avançar pelos passos 2 e 3
3. No **Passo 4** (asse 40 min) → toque **Errei**
4. Ouça a instrução de **recuperação** → **Confirma** para voltar ao fluxo
5. Toque **Temperatura** → alerta de panela quente
6. **Confirma** → receita concluída

### 6. Persistência

1. Edite uma receita ou crie uma nova
2. Feche o app completamente e reabra
3. Suas receitas, favoritos e configurações devem estar preservados

## Hooks principais

```typescript
import { useSettings, useRecipes, useDialogMode } from './src/hooks';

const { settings, updateSettings, theme, typography } = useSettings();
const { recipes, toggleFavorite, addRecipe } = useRecipes();
```

## Persistência (AsyncStorage)

| Chave | Conteúdo |
|-------|----------|
| `@kitchen/settings` | Tema, fonte, voz, restrições, etc. |
| `@kitchen/user` | Cadastro do usuário |
| `@kitchen/recipes` | Receitas (mock editadas + customizadas + favoritos) |

## Comandos simulados no modo diálogo

| Comando | Ação |
|---------|------|
| Confirma | Avança ou sai de recuperação/adaptação |
| Próximo passo | Avança forçado |
| Errei | Ativa instrução de recuperação |
| Repetir | Re-lê o passo atual |
| Adaptar receita | Mostra sugestão de adaptação |
| Temperatura | Consulta cozinha conectada |
| Parar receita | Encerra o modo diálogo |

## Licença

Projeto acadêmico — IHM.
