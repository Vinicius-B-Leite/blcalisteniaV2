# Complete Set Action — WorkoutSession Screen

## Problema

Na tela `WorkoutSession`, o botão "Concluir série" (dentro de `Actions.tsx`) hoje é
estático: `isActive={false}`, sem `onPress`. Não existe nenhum mecanismo de
progresso de série/exercício — `focusedExercise` é hardcoded em
`exercisesWithSets[0]`, `activeExerciseIndex` é hardcoded em `0`, e o label
"1 de X séries" também é fixo. Os botões de descanso (`+ 10 segundos`,
`Pular descanso`) e o botão de timer (`01:30`) também são decorativos — não há
countdown real.

## Decisão: sem persistência (por ora)

O progresso da sessão de treino (série atual, exercício atual, timer de
descanso) é **estado efêmero**, guardado localmente no hook
`useWorkoutSession`. Não grava em `Domain`/`Infra`/DB.

**Por quê:** se o usuário fechar o app no meio do treino, perder o progresso
é aceitável por enquanto. Isso evita mexer em `WorkoutExerciseSetModel`
(hoje só tem `id, workoutExerciseId, reps, rest` — sem campo de conclusão) e
mantém a mudança isolada na camada de UI.

**Como aplicar:** toda a lógica abaixo vive em `useState`/`setInterval` dentro
de `useWorkoutSession.ts`. Nenhuma mudança em Domain ou Infra é necessária
para este escopo.

## Modelo de estado

```ts
currentExerciseIndex: number   // índice em exercisesWithSets
completedSets: number          // séries concluídas do exercício atual
restSecondsLeft: number | null // null = idle, número = resting (countdown ativo)
```

- `focusedExercise = exercisesWithSets[currentExerciseIndex]` (substitui o
  hardcode em `[0]`).
- Progresso é sempre sequencial (uma série de cada vez, sem pular série ou
  exercício) — por isso um contador simples é suficiente, sem precisar de
  array de booleans por set nem histórico de eventos.

## State machine

**idle** (`restSecondsLeft === null`)
- `Concluir série`: ativo
- `+ 10 segundos`: desabilitado
- `Pular descanso`: desabilitado

**resting** (`restSecondsLeft` é número > 0)
- `Concluir série`: desabilitado
- `+ 10 segundos`: ativo — soma 10 em `restSecondsLeft`
- `Pular descanso`: ativo — zera `restSecondsLeft` na hora (mesmo caminho do
  countdown chegar a 0 naturalmente)
- countdown decrementa 1 por segundo via `setInterval` (com cleanup)

**resting, `restSecondsLeft === 0`** (transição, não é um estado estável)
- `Pular descanso` desabilita (não há mais o que pular)
- auto-transiciona imediatamente pro próximo passo (ver "Transições" abaixo)

## Transições ao completar uma série

1. Usuário aperta `Concluir série` (só possível em idle):
   - `completedSets++`
   - entra em resting com `restSecondsLeft = set.rest` (da série recém-concluída)

2. `restSecondsLeft` chega a 0 (natural ou via "Pular descanso"):
   - se `completedSets < total de séries do exercício atual` → volta pro idle,
     próxima série do mesmo exercício fica disponível
   - se `completedSets === total de séries do exercício atual` (última série
     do exercício) → avança de exercício: `currentExerciseIndex++`,
     `completedSets = 0`, volta pro idle
   - se o exercício que acabou de ser concluído já era o **último** da lista
     (`currentExerciseIndex === exercisesWithSets.length - 1`) → em vez de
     avançar, dispara `alert("treino finalizado")` (placeholder de teste —
     fluxo real de fim de treino fica para depois)

## Fora de escopo (decisões explícitas para não perder depois)

- **Fim de treino real**: por ora só `alert("treino finalizado")`. Vai
  precisar de spec própria (tela de resumo? navegação? grava resultado?).
- **Desfazer última série concluída**: funcionalidade não implementada agora,
  mas o modelo de estado (index + counter, progresso sempre sequencial) já
  suporta de graça — desfazer é só andar um passo atrás:
  `completedSets--`, e se já estava em 0, `currentExerciseIndex--` +
  `completedSets = total de séries do exercício anterior - 1`. Não requer
  stack de histórico nem mudança de estrutura quando for implementado.
- **Persistência de progresso** (retomar treino após fechar o app): decidido
  que não é necessário agora — ver seção "Decisão: sem persistência" acima.

## Próximo passo

Usuário vai levar este documento para a skill `refine-spec` para formalizar
antes de implementar.
