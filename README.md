# Cozinha Assistida

Aplicativo mobile em React Native (Expo) que atua como assistente inteligente de receitas por voz para ambientes de cozinha conectada — projeto de IHM.

## Stack

- React Native + Expo (SDK 54)
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
├── server/
│   ├── kitchen/          # Gateway embarcados — porta 8770
│   └── tts/              # Voz neural — porta 8765
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

No terminal do Expo, pressione **`s`** para modo **Expo Go** e escaneie o QR no celular (mesma rede Wi‑Fi do PC).

Verificação de tipos:

```bash
npm run lint
```

---

## Servidores locais (PC + celular)

Na demo, o **celular roda o app** e o **PC roda serviços auxiliares** na mesma rede Wi‑Fi. O app descobre o IP do PC automaticamente (mesmo IP do Metro/Expo). Portas fixas:

| Serviço | Porta | Pasta no repo | Comando |
|---------|-------|---------------|---------|
| **Voz neural (TTS)** | `8765` | `server/tts/` | `npm run tts-server` |
| **Gateway embarcados** | `8770` | `server/kitchen/` | `npm run kitchen-server` |

Dependências Python (uma vez):

```bash
pip install -r server/tts/requirements.txt
pip install flask flask-cors
```

**Ordem sugerida para demo completa:**

```bash
# Terminal 1 — gateway dos embarcados (status Cozinha online/offline)
npm run kitchen-server

# Terminal 2 — voz do assistente (opcional, fallback: TTS do celular)
npm run tts-server

# Terminal 3 — app
npm start
```

Teste rápido no navegador do PC:

- `http://localhost:8770/status` → cozinha conectada
- `http://localhost:8765/health` → TTS ok

No app: **Configurações** → ativar **Monitorar cozinha** e **Usar voz neural do PC** (IP manual só se o auto falhar).

---

## Integração com hardware (para quem conecta os embarcados)

### O que o app espera

O app consulta o **gateway da cozinha** a cada 5 segundos:

```http
GET http://<IP-DO-GATEWAY>:8770/status
Accept: application/json
```

Resposta JSON obrigatória:

```json
{
  "online": true,
  "temperature": 52,
  "state": "idle",
  "sensors": {
    "pan": { "id": "slider", "celsius": 52, "alert": true },
    "color": { "id": "tcs3200", "level": "golden", "alert": false },
    "sound": { "id": "sound", "level": 25, "alert": false }
  }
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `online` | boolean | `true` se sensores/embarcados respondendo |
| `temperature` | number | Temperatura da **panela** em °C (atalho = `sensors.pan.celsius`) |
| `state` | string | `"idle"` \| `"preparing"` \| `"alert"` |
| `sensors.pan` | object | Slider no Pico W — alerta se `celsius > 40` |
| `sensors.color` | object | TCS3200 na Micro:bit — `level`: `light` \| `golden` \| `dark` \| `burned`; alerta em `dark`/`burned` |
| `sensors.sound` | object | Sensor de som no Pico W — `level` 0–100; alerta se `≥ 70` |

Simular no mock (query string):

```http
GET /status?pan=52&color=golden&sound=25
GET /status?pan=55&color=burned&sound=85
```

---

### Sensores na cozinha conectada (3)

| Chip | Hardware | Controlador | Alerta |
|------|----------|-------------|--------|
| **Panela** | Slider | Pico W | > 40 °C |
| **Cor** | TCS3200 | Micro:bit | `dark` / `burned` |
| **Som** | Sensor de som | Pico W | ≥ 70% |

**Atuadores de feedback (recomendado):**

| Atuador | Quando acionar |
|---------|------------------|
| **LED vermelho + buzzer** | Panela quente, cor escura/queimada ou som alto |
| **LED verde** | Tudo normal (`state: idle`) |

---

### Configuração dos controladores

```
┌─────────────┐     serial/USB      ┌──────────────┐     Wi‑Fi      ┌─────────┐
│ Micro:bit   │ ──────────────────► │  PC (Python  │ ◄────────────► │  App    │
│ TCS3200     │   JSON linha/serial │  gateway     │   :8770      │  Expo   │
└─────────────┘                     │  server.py   │              └─────────┘
                                    └──────▲───────┘
┌─────────────┐     Wi‑Fi ou serial         │
│ Pico W      │ ────────────────────────────┘
│ Slider + Som│
└─────────────┘
```

**Opção simples (recomendada):**

1. **Micro:bit** lê **TCS3200** → envia JSON por **USB serial** para o PC.
2. **Pico W** lê **slider** + **sensor de som** no **ADC** → serial ou Wi‑Fi para o PC.
3. **PC** roda `server/kitchen/server.py` e publica **`GET /status`** na porta **8770**.

Firmware de referência: parta de `server/kitchen/server.py` (valores mock) e substitua por leituras reais mantendo o **mesmo JSON**.

---

```http
GET http://<IP-DO-GATEWAY>:8770/health
→ { "ok": true }
```

### Onde está no código

| O quê | Arquivo |
|-------|---------|
| Mock do gateway (referência) | `server/kitchen/server.py` |
| Cliente HTTP + temperatura | `src/services/connectedKitchenService.ts` |
| URL/porta do gateway | `src/constants/kitchenConfig.ts` |
| Poll online/offline na UI | `src/hooks/useKitchenConnection.ts` |
| Badge **Cozinha online/offline** | `src/components/KitchenStatusBadge.tsx` |
| Chips dos 3 sensores | `src/components/KitchenSensorStrip.tsx` |
| Mapa hardware ↔ função | `src/constants/kitchenSensors.ts` |

### Como substituir o mock pelo hardware real

1. **Opção A — Gateway no PC/RPi** (recomendado para integração gradual)  
   - Embarcados (ESP32, Arduino, etc.) enviam dados via serial/MQTT/Wi‑Fi para um serviço no PC.  
   - Esse serviço expõe **`GET /status`** na porta **8770** com o JSON acima.  
   - Use `server/kitchen/server.py` como base e troque os valores mock pela leitura real.

2. **Opção B — Embarcado expõe HTTP direto**  
   - Se o microcontrolador servir HTTP, implemente **`GET /status`** no firmware.  
   - No app: **Configurações → Cozinha conectada → Endereço do gateway** = IP do embarcado (ex.: `192.168.1.50`).

3. **Offline**  
   - Se `/status` não responder, o app mostra **Cozinha offline** e usa temperatura simulada no comando **Temperatura**.

### Regras de alerta (já implementadas no app)

- Panela `> 40 °C` → *"Cuidado, a panela está quente."*
- Cor `dark` / `burned` → *"Risco de queimar!"*
- Som `≥ 70%` → *"Som intenso — verifique a panela."*
- Comando de voz **Temperatura** usa `checkPanTemperature()` com prioridade: cor → som → panela.

### TTS (voz do assistente) — separado do hardware

Voz **não** passa pelo gateway de embarcados. Serviço próprio:

```http
GET http://<IP-DO-PC>:8765/speak?text=<texto>&voice=jacquin
→ audio/mpeg
```

Perfis de voz mapeados em `server/tts/server.py` (`jacquin`, `palmirinha`, etc.).

---

## Funcionalidades

| Área | Descrição |
|------|-----------|
| **Buscar receitas** | Busca, filtros (categoria, festividade, tempo) e ordenação |
| **Favoritos** | Receitas salvas com ★ (persistidas) |
| **CRUD visual** | Criar, editar, copiar e compartilhar receitas |
| **Modo agente** | Tela unificada: escolha de receita, ingredientes e preparo com assistente |
| **Cozinha conectada** | Status online/offline + temperatura via gateway `:8770` |
| **Voz neural (PC)** | TTS edge-tts via servidor `:8765` (fallback: voz do celular) |
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

### 5. Modo agente (fluxo principal)

1. Home → **Modo agente**
2. Escolha uma receita (sugestão ou favorito)
3. Marque ingredientes → **Confirma**
4. Siga os passos com TTS; use chips **Confirma**, **Errei**, **Temperatura**, etc.
5. Badge **Cozinha online** deve aparecer se `npm run kitchen-server` estiver rodando

### 5b. Modo diálogo clássico (telas separadas)

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
