# Technical Specification: Set Completed Indicator — WorkoutSession

## 1. Visão Geral

Na tela `WorkoutSession`, quando o descanso de uma série termina (natural ou via skip), o círculo indicador daquela série em `SerieItem` passa a refletir visualmente que ela foi concluída — fundo e borda na cor de contraste (`theme.surface.brand`), número substituído por um ícone de check. O indicador textual "X de N séries" passa a refletir o progresso real (hoje fixo em "1 de N séries").

## 2. Localização e Estrutura

- Tela: `src/ui/screens/WorkoutSession/`
- Hook da tela: `useWorkoutSession.ts` — muda **onde** `completedSets` incrementa (ver seção 6)
- Componentes existentes que mudam: `WorkoutSession.tsx`, `components/FocusedExercise/FocusedExercise.tsx`, `components/FocusedExercise/SerieItem.tsx`, `components/FocusedExercise/styles.ts`, `components/FocusedExercise/types.ts`, `constants.ts`
- Componente novo: `IconCheck` em `src/ui/components/core/Icon/components/IconCheck.tsx` + registro em `Icon.tsx` / `IconTypes.ts` (nome `check`, seguir skill `create-core-components`)
- Variante nova no componente `Icon`: `onBrand` → `color: theme.text["text-on-brand"]` (não existe hoje; variantes atuais são `default`/`secondary`/`error`/`brand`)
- Nenhuma mudança em `src/domain/` ou `src/infra/repos/` — sem novo `Model`, sem novo repositório, sem schema WatermelonDB.

## 3. Fluxos do Usuário

### 3.1 Happy Path

1. Usuário está na série N de um exercício. Círculo mostra número, estilo "pending" (cinza, como hoje).
2. Aperta `Concluir série` → `completeSet()` lê `sets[completedSets].rest` e inicia o rest timer. **Círculo continua pending** — `completedSets` não incrementa aqui (mudança de onde o incremento acontece, ver seção 6).
3. Durante o descanso (countdown rodando, `+10s`/`Pular descanso` ativos), círculo da série em andamento segue pending.
4. Countdown chega a 0 (natural ou via `Pular descanso`) → `advanceAfterRest()` dispara: incrementa `completedSets`.
5. Nesse instante, o círculo da série recém-concluída vira "completed": `backgroundColor`/`borderColor` → `theme.surface.brand`; número some; entra `<Icon name="check" variant="onBrand">`.
6. Indicador textual "X de N séries" atualiza para `min(completedSets + 1, setsCount)`.
7. Se o exercício não terminou: segue pra próxima série, `Concluir série` reabilita (comportamento já existente).
8. Se terminou e não é o último exercício: `currentExerciseIndex++`, `completedSets` reseta pra 0 → círculos do novo exercício voltam todos pending, indicador reseta pra "1 de M séries".
9. Se terminou e é o último exercício: `completedSets === setsCount`, todos os círculos ficam completed, indicador mostra "N de N séries", `alert("Treino finalizado!")` dispara (comportamento já existente, sem mudança).

### 3.2 Fluxos Alternativos

- Nenhum novo. Sair da tela (`ExitConfirmationModal`) já existe e não muda — não há persistência em DB, então sair sempre perde o progresso, igual hoje.
- Não existe fluxo de desmarcar uma série já concluída (fora de escopo).

**Decisões:** confirmado acima em brainstorm prévio, sem pontos em aberto.

## 4. Estados da UI

| Estado | Comportamento |
| --- | --- |
| Círculo "pending" | `backgroundColor: theme.surface.container`, borda `theme.border.default`, número da série visível (comportamento atual, sem mudança) |
| Círculo "completed" | `backgroundColor`/`borderColor: theme.surface.brand`, número substituído por `<Icon name="check" variant="onBrand">` |
| Texto de reps (`{reps} reps`) | Nunca muda — permanece igual em pending e completed |
| Indicador "X de N séries" | Dinâmico: `min(completedSets + 1, setsCount)` de `setsCount` séries (hoje hardcoded em "1 de N séries") |

Sem loading/error/paginação — é estado local síncrono derivado de `completedSets`.

## 5. Definição do Formulário e Validação

N/A — sem formulário, input ou campo nesse escopo.

## 6. Fluxo de Estado e Persistência

⚠️ **Mudança arquitetural no hook, não só estilo:** `completedSets` muda de semântica — de "quantidade de séries com `completeSet()` chamado" (incrementa imediato) para "quantidade de séries com descanso terminado" (incrementa em `advanceAfterRest`).

- `completeSet()` (`useWorkoutSession.ts`): deixa de chamar `setCompletedSets(prev => prev + 1)`. Só lê `focusedExercise.sets[completedSets]` pra obter o `rest` da série que está sendo concluída e retorna esse valor (usado por `Actions.tsx` pra iniciar o timer).
- `advanceAfterRest()` (`useWorkoutSession.ts`, chamado como `onFinish` de `useRestTimer` — dispara tanto no countdown chegando a 0 quanto no `Pular descanso`): passa a calcular `const newCompletedSets = completedSets + 1`, chamar `setCompletedSets(newCompletedSets)`, e usar `newCompletedSets` (não o `completedSets` antigo) pra decidir `finishedExercise = newCompletedSets >= focusedExercise.sets.length`.
- Resto da lógica de `advanceAfterRest` (avançar exercício / resetar / alert de treino finalizado) não muda, só passa a operar sobre `newCompletedSets`.
- Nenhuma persistência em DB — comportamento efêmero já existente, sem mudança.

## 7. Regras de Negócio e Edge Cases

- Indicador "X de N séries": `min(completedSets + 1, setsCount)` — mostra a série "na mira" agora. `completedSets = 0` → "1 de N"; `completedSets = N` (todas feitas, último exercício) → "N de N".
- Última série do último exercício: `completedSets` chega a `setsCount`, todos os círculos ficam completed, alert dispara, **sem reset** (comportamento já existente — não muda).
- Troca de exercício: `completedSets` reseta pra 0 (já existente), círculos do exercício novo voltam todos pending.
- Sem fluxo de desmarcar série — não existe hoje, fora de escopo.
- Nenhuma race condition nova: reaproveita o guard já existente em `useRestTimer` (`if (isResting) return` em `start`) que previne double-tap/reentrância — não precisa de guard adicional pro `completedSets`.
- N/A: duplicidade de dado, limite de itens, retry de rede, offline, expiração de sessão — sem chamada de rede/repo nesse escopo.

## 8. Decisões de Arquitetura

### Domain

Nenhuma mudança.

### Infra

Nenhuma mudança.

### UI

- `useWorkoutSession.ts`: mover o incremento de `completedSets` de `completeSet()` pra `advanceAfterRest()` (seção 6). Assinatura de retorno do hook não muda — `completedSets` já é exposto em `state`.
- `WorkoutSession.tsx`: passar `state.completedSets` como nova prop pra `FocusedExercise`.
- `FocusedExercise.tsx` / `types.ts`: `FocusedExerciseProps` ganha `completedSets: number`. Calcula `completed={i < completedSets}` por `SerieItem` no `.map`. Texto do indicador troca de `"1 de {setsCount} séries"` pra `` `${Math.min(completedSets + 1, setsCount)} de ${setsCount} séries` ``, com `testID={WORKOUT_SESSION_SCREEN_TEST_IDS.SET_PROGRESS_CURRENT}` (testID já reservado em `constants.ts`, não usado ainda).
- `SerieItem.tsx` / `types.ts`: `SerieItemProps` ganha `completed: boolean`. Quando `completed`, aplica estilo alternativo no `serieItemNumber` (bg/borda `theme.surface.brand`) e renderiza `<Icon name="check" size={16} variant="onBrand" testID={WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_COMPLETED} />` no lugar do `<Text variant="body-small-bold">{serie}</Text>`.
- `styles.ts` (FocusedExercise): novo estilo `serieItemNumberCompleted` — `{ backgroundColor: theme.surface.brand, borderColor: theme.surface.brand }`, aplicado condicionalmente junto de `serieItemNumber`.
- `Icon` (core component): novo `IconCheck.tsx` seguindo o padrão dos ícones existentes (`IconX.tsx` etc.), registrado em `IconMap` (`Icon.tsx`) com chave `check`. Nova variante `onBrand` adicionada em `variantsKey` (`IconTypes.ts`) e no mapa de `variants` (`Icon.tsx`) → `color: theme.text["text-on-brand"]`.
- `AGENTS.md`: adicionar `check` à lista de ícones válidos.
- `constants.ts`: novo testID `SET_ITEM_COMPLETED` (estático, um por círculo completed — contar via `queryAllByTestId(...).length`, mesmo padrão de `SET_ITEM`).

### Navegação

Nenhuma mudança.

## 9. Plano de Testes

Fixtures existentes em `__mocks__/workoutSessionMocks.ts` já cobrem os cenários necessários: `we-1` (3 sets, exercício em foco por padrão), `we-2` (2 sets), `we-3` (4 sets, testa `hasManySets`), `singleSetExercise` (1 set, último exercício).

Cenários obrigatórios de teste de integração:

- (a) Completar uma série mas **não** avançar o rest timer → círculo continua pending (`queryAllByTestId(SET_ITEM_COMPLETED).length === 0`), indicador continua "1 de 3 séries".
- (b) Rest termina naturalmente (`jest.advanceTimersByTime`) → 1 círculo completed (`queryAllByTestId(SET_ITEM_COMPLETED).length === 1`), indicador atualiza pra "2 de 3 séries".
- (c) `Pular descanso` também marca completed (mesma lógica do `onFinish`, via `SKIP_REST_BUTTON`).
- (d) Completar todas as séries de um exercício (`we-2`, 2 sets) → todos círculos completed antes de avançar; ao trocar de exercício, círculos do novo exercício voltam todos pending, indicador reseta "1 de M séries".
- (e) Última série do último exercício (`singleSetExercise`) → círculo completed, indicador "1 de 1 séries", alert de treino finalizado dispara (comportamento já existente, sem mudança).
- (f) Texto de reps (`SET_ITEM_REPS`) não muda em nenhum estado — regressão do comportamento existente.

**TestIDs necessários:**
- Novo: `SET_ITEM_COMPLETED` (estático, contagem via `queryAllByTestId`).
- Já reservado, passa a ser usado: `SET_PROGRESS_CURRENT` (checar `.props.children`).

**Timers em teste:** reaproveita `jest.useFakeTimers()` + `jest.advanceTimersByTime()` já usado nos testes existentes do rest timer.

**Logging/Observabilidade:** N/A — sem chamada de rede/repo nesse escopo.
