# Technical Specification: Complete Set Action — WorkoutSession

## 1. Visão Geral

Na tela `WorkoutSession`, o usuário conclui a série atual do exercício em
foco, entra num período de descanso com countdown, e o app avança
automaticamente para a próxima série (ou próximo exercício) quando o
descanso termina. Todo o progresso é efêmero — não persiste em Domain/Infra.

## 2. Localização e Estrutura

- Tela: `src/ui/screens/WorkoutSession/`
- Hook da tela: `useWorkoutSession.ts` (state de progresso: exercício/série
  atual)
- Hook novo dedicado: `useRestTimer.ts` (countdown de descanso)
- Componente existente que ganha comportamento: `components/Actions/Actions.tsx`
  e `components/Actions/ActionButton.tsx` (hoje estáticos, sem `onPress`)
- Componente novo: `components/ExitConfirmationModal/` (modal de confirmação
  de saída, usando `Modal.Root`)
- Nenhuma mudança em `src/domain/` ou `src/infra/repos/` — sem novo `Model`,
  sem novo repositório, sem schema WatermelonDB.

## 3. Fluxos do Usuário

### 3.1 Happy Path

1. Usuário está na série N de um exercício, estado `idle`, botão
   `Concluir série` ativo, `+10s`/`Pular descanso` desabilitados.
2. Usuário aperta `Concluir série` → `completedSets++`, entra em `resting`
   com `restSecondsLeft = set.rest` da série concluída.
3. Em `resting`: `Concluir série` desabilita; `+10s` e `Pular descanso`
   habilitam; countdown decrementa 1/segundo.
4. Usuário pode apertar `+10s` quantas vezes quiser (soma 10s cada vez, sem
   teto) ou `Pular descanso` (zera o countdown na hora).
5. Countdown chega a 0 (natural ou via skip) → `Pular descanso` desabilita
   nesse instante e o app auto-avança:
   - se ainda há séries no exercício atual → volta pro `idle`, próxima série
     disponível
   - se era a última série do exercício e não é o último exercício da lista
     → `currentExerciseIndex++`, `completedSets = 0`, volta pro `idle`,
     `focusedExercise` troca
   - se era a última série do último exercício → `alert("treino
     finalizado")` (placeholder; fluxo real de fim de treino é out of scope)

### 3.2 Fluxos Alternativos

- **Sair da tela (qualquer estado, idle ou resting)**: tanto pelo
  `Header.GoBack` quanto pelo back nativo do device (hardware/gesture)
  sempre abre `ExitConfirmationModal` antes de sair, já que qualquer saída
  perde o progresso da sessão (sem persistência).
- **Tap fora do modal**: equivale a cancelar — fecha o modal, permanece na
  tela, nada acontece.
- **Sair com o alert de "treino finalizado" na tela**: por ora, nada
  acontece de especial — não dispara o modal de confirmação (fluxo real
  ainda não definido).
- Nenhuma ação nesse escopo é destrutiva a ponto de exigir confirmação
  própria (só a saída de tela tem confirmação).
- Autenticação/permissões: herda do fluxo já existente da tela — sem
  papéis diferentes.

**Decisões:** confirmado acima, sem pontos em aberto.

## 4. Estados da UI

| Estado | Comportamento |
| --- | --- |
| Loading (dados do treino) | Já tratado por `LoadingState` existente — sem mudança |
| Empty (sem exercícios) | Já tratado por `EmptyState` existente — sem mudança |
| Error (falha ao carregar) | Já tratado via `onError: () => router.back()` em `useGetWorkoutById` — sem mudança |
| `idle` | `Concluir série` ativo; `+10s`/`Pular descanso` desabilitados; botão primário (`01:30`) só exibe valor, nunca clicável nem desabilitado |
| `resting` | `Concluir série` desabilitado; `+10s`/`Pular descanso` ativos; countdown rodando no botão primário |
| `resting`, `restSecondsLeft === 0` | Transição instantânea — `Pular descanso` desabilita nesse instante, mas já auto-avança pro próximo estado (não é estável) |
| Modal de saída aberto | `Modal.Root` com overlay; tap fora = cancelar (fecha, mantém tela); botões internos "Cancelar"/"Sair" |

Não há paginação, optimistic update, nem estados adicionais de read-only
além dos três `ActionButton`.

## 5. Definição do Formulário e Validação

N/A — não há formulário, input ou campo nesse escopo. Nenhuma regra de
validação de dado.

## 6. Fluxo de Estado e Persistência

- Estado de progresso (`currentExerciseIndex`, `completedSets`) vive em
  `useWorkoutSession.ts`.
- Estado do countdown (`restSecondsLeft`) vive em hook dedicado
  `useRestTimer.ts`, usando `setInterval` com callback funcional
  (`setRestSecondsLeft(prev => prev - 1)`) para evitar closure stale, e
  cleanup no unmount/transição de estado.
- Nenhuma persistência em DB — fechar o app ou sair da tela perde todo o
  progresso da sessão. Isso é intencional (decisão do brainstorm
  [02-complete-set-action.md](../brainstorms/02-complete-set-action.md)).
- Guard: a função que inicia o `resting` só executa se o estado atual não
  já estiver em `resting` (previne double-tap/double-fire).

## 7. Regras de Negócio e Edge Cases

- Progresso é sempre sequencial (uma série por vez, sem pular) — por isso
  `currentExerciseIndex` + `completedSets` (contadores) bastam; não precisa
  de array de booleans por set nem histórico de eventos.
- `+10s` pode ser empilhado quantas vezes o usuário quiser, sem limite
  máximo.
- Double-tap em `Concluir série`: resolvido pela combinação de (a) o botão
  desabilitar assim que entra em `resting`, e (b) guard na função de início
  do `resting` que só roda se não estiver já em `resting`.
- ⚠️ **Fora de escopo, mas o design já suporta sem refatoração futura**:
  desfazer a última série concluída. Como o progresso é sequencial, desfazer
  é só andar um passo atrás: `completedSets--`, e se já em 0,
  `currentExerciseIndex--` + `completedSets = total de séries do exercício
  anterior - 1`.
- ⚠️ **Fora de escopo**: fluxo real de fim de treino (hoje só
  `alert("treino finalizado")` como placeholder de teste).
- N/A: duplicidade de dado, item removido por outro processo, limite de
  itens, retry de rede, offline, expiração de sessão — não há chamada de
  rede/repo nesse escopo.

## 8. Decisões de Arquitetura

### Domain

Nenhuma mudança. Nenhum `Model` novo, nenhuma interface de repositório
nova.

### Infra

Nenhuma mudança. Nenhum repositório novo, nenhuma query key nova, nenhum
schema/migration do WatermelonDB.

### UI

- `useWorkoutSession.ts`: ganha `currentExerciseIndex`, `completedSets`,
  deriva `focusedExercise = exercisesWithSets[currentExerciseIndex]`
  (substitui hardcode em `[0]`), e a função `completeSet()` que orquestra a
  transição de série/exercício/fim de treino.
- `useRestTimer.ts` (novo hook dedicado): expõe `restSecondsLeft`,
  `start(seconds)`, `addSeconds(10)`, `skip()`. Countdown via `setInterval`
  com callback funcional, cleanup automático.
- `ActionButton` (`components/Actions/ActionButton.tsx`): ganha `onPress` e
  `isActive` dinâmicos vindos do hook — sem mudar a assinatura/estrutura
  existente do componente.
- `Actions.tsx`: passa os handlers/estados derivados dos hooks pros três
  `ActionButton`.
- `ExitConfirmationModal` (novo componente em
  `WorkoutSession/components/ExitConfirmationModal/`): usa `Modal.Root`,
  overlay, tap fora fecha (equivale a cancelar), título/corpo/botões
  "Cancelar"/"Sair".
- `WorkoutSession.tsx`: renderiza o `ExitConfirmationModal`, controla sua
  visibilidade via state local.

### Navegação

- Intercepta tanto o `Header.GoBack` (chamada direta ao handler) quanto o
  back nativo do device via `navigation.addListener('beforeRemove', ...)`
  (React Navigation por baixo do expo-router) — ambos abrem o mesmo modal
  de confirmação antes de permitir a saída.
- Nenhuma rota nova, nenhum parâmetro novo.

## 9. Plano de Testes

Cenários obrigatórios de teste de integração:

- (a) Apertar `Concluir série` avança a série, desabilita o próprio botão e
  habilita `+10s`/`Pular descanso`.
- (b) `+10s` soma no countdown exibido.
- (c) `Pular descanso` zera o countdown e auto-avança.
- (d) Countdown chegando a 0 sozinho (via `jest.advanceTimersByTime`)
  auto-avança sem interação.
- (e) Concluir a última série de um exercício avança pro próximo exercício
  (reseta `completedSets`, troca `focusedExercise` exibido).
- (f) Concluir a última série do último exercício dispara o alert de treino
  finalizado.
- (g) `Header.GoBack` e back nativo abrem o modal de confirmação; tap fora
  fecha o modal e mantém o usuário na tela.

**TestIDs necessários** (seguir convenção `WORKOUT_SESSION_SCREEN_TEST_IDS`
em `constants.ts`):
- Já devem existir (conferir) para `Concluir série` / `+10s` / `Pular
  descanso` via `ActionButton`.
- Novos: modal de confirmação (`EXIT_CONFIRMATION_MODAL`), botão "Cancelar"
  (`EXIT_CONFIRMATION_CANCEL_BUTTON`), botão "Sair"
  (`EXIT_CONFIRMATION_CONFIRM_BUTTON`).

**Timers em teste**: usar `jest.useFakeTimers()` +
`jest.advanceTimersByTime()` para simular a passagem do countdown, sem
esperar tempo real.

**Logging/Observabilidade**: N/A — sem chamada de rede/repo nesse escopo,
sem necessidade de `handleError`/Sentry.
