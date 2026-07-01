# Brainstorm: persistência da sessão de treino

**Data:** 2026-07-01
**Contexto:** item "sessão de treino" em `notes.txt` (seção "Em desenvolvimento"). Tela `WorkoutSession` já existe como shell de UI (`src/ui/screens/WorkoutSession/`), sem lógica de dados ainda.

## Problema

O treino (`Workout` → `WorkoutExercise` → `WorkoutExerciseSet`) é um **modelo/template**: define exercícios, número de séries e reps planejadas. Quando o cliente efetivamente treina, ele não necessariamente bate o plano — pode fazer mais ou menos séries, reps diferentes, etc. Não queremos sobrescrever o template (`WorkoutExerciseSet`) com os dados reais da execução. Precisamos de um lugar separado para registrar o que aconteceu de fato em cada sessão de treino.

## Decisões tomadas

### 1. Duas entidades novas, sem tocar no template existente

Não reaproveita `WorkoutExerciseSet` para dados reais — misturaria plano com execução na mesma tabela. Criar:

**`WorkoutSession`**
| Campo | Tipo | Observação |
|---|---|---|
| `id` | string | |
| `workoutId` | string | FK para o treino/template |
| `status` | `"in_progress" \| "completed" \| "canceled"` | ver seção Status abaixo |
| `startDate` | Date | criada quando a sessão começa |
| `endDate` | Date \| null | preenchido em `completed` **e** `canceled` |

**`WorkoutSessionSet`**
| Campo | Tipo | Observação |
|---|---|---|
| `id` | string | |
| `workoutSessionId` | string | FK para `WorkoutSession` |
| `workoutExerciseId` | string | FK para o exercício do treino (template) |
| `order` | number | ordem da série dentro do exercício na sessão |
| `reps` | number | valor real executado |
| `rest` | number | ver seção Rest abaixo |

Decisão explícita: **não criar** uma entidade intermediária tipo `WorkoutSessionExercise`. O nome/ordem do exercício em si vem direto do `WorkoutExercise` original via `workoutExerciseId` — a sessão não precisa duplicar essa informação porque a lista de exercícios não muda no meio do treino, só a quantidade de séries executadas por exercício pode variar.

### 2. Registro só é criado quando a série é concluída

`WorkoutSessionSet` **não é pré-populado** copiando a contagem de séries do template ao iniciar a sessão. A tela começa vazia; cada linha só é gravada no banco quando o usuário aperta "Concluir série" (ação já prevista na UI, ver `Actions` em `WorkoutSession.tsx`).

Consequência direta: como não há relação 1:1 fixa entre `WorkoutSessionSet` e `WorkoutExerciseSet`, nada impede o cliente de fazer mais séries do que o planejado — resolve de graça o item do `notes.txt` "como fica +3 séries?". Também resolve o fluxo "se a série já completa, ao clicar nela deve abrir input" (`notes.txt`) — é a mesma linha sendo atualizada via update, não uma nova criação.

### 3. Campo `rest`: valor planejado, atualizável

Inicialmente `rest` copia o valor planejado do `WorkoutExerciseSet` correspondente (não é medido ao vivo por padrão). Se o cliente ajustar o descanso durante a série (botões "+10 segundos" / "pular descanso" já existentes na UI de `Actions`), o valor real do ajuste **deve atualizar essa mesma coluna** em `WorkoutSessionSet` — não fica um campo "planejado" e outro "real" separados, é uma coluna só que reflete o valor final usado.

### 4. Status da sessão — suporte a retomar treino incompleto

Necessidade: se o cliente sai da tela/app no meio do treino e volta depois, ele deve poder retomar de onde parou em vez de recomeçar do zero.

Solução: campo `status` em `WorkoutSession` com três valores:
- `in_progress` — sessão criada, ainda não finalizada
- `completed` — treino finalizado
- `canceled` — treino abandonado/descartado deliberadamente (permite ao cliente recomeçar do zero em vez de ficar preso a retomar uma sessão travada há dias)

**Lógica de retomada:** ao abrir a tela de sessão para um `workoutId`, buscar se já existe uma `WorkoutSession` com `status = "in_progress"` para aquele treino.
- Se existir → carregar essa sessão + os `WorkoutSessionSet` já registrados e continuar dali.
- Se não existir → criar uma nova `WorkoutSession`.

**Como uma sessão vira `completed`:** dois gatilhos possíveis (não é mutuamente exclusivo, ambos levam ao mesmo resultado: grava `status = completed` + `endDate`)
1. Botão explícito "Finalizar treino" (ainda **não existe na UI atual** — precisa ser adicionado), que pode ser clicado a qualquer momento. Os `WorkoutSessionSet` salvos são apenas os que já foram concluídos até aquele ponto — não é preciso lógica extra, é consequência natural de só gravar no "concluir série".
2. Gatilho automático: cliente navega pelo fluxo guiado e termina todos os sets normalmente até o fim do plano (última série do último exercício) — a navegação natural do app até o fim também dispara a conclusão, sem precisar apertar um botão separado.

**Como uma sessão vira `canceled`:** ação explícita do cliente para descartar a sessão em andamento (ex: um botão "descartar treino" — UI ainda não definida). Ao cancelar, também grava `endDate` (momento do cancelamento), reaproveitando o mesmo campo usado por `completed`.

## Pontos em aberto (decisão futura)

### O que acontece com `WorkoutSessionSet.workoutExerciseId` se o `WorkoutExercise` for deletado?

Investigação feita durante o brainstorm: hoje `removeExercise` em `WatermelonWorkoutExerciseRepo.ts` (`src/infra/repos/WorkoutExercise/implementations/watermelon/WatermelonWorkoutExerciseRepo.ts:194`) faz **hard delete** (`destroyPermanently()`), mesmo a tabela `workout_exercises` já tendo uma coluna `deleted_at` usada nas queries de listagem (`Q.where("deleted_at", null)`) — sugere que soft-delete era a intenção original mas ficou incompleto, já que nada popula essa coluna atualmente.

Se o cliente deletar um `WorkoutExercise` que já tem sessões passadas referenciando ele via `workoutExerciseId`, a FK fica órfã e o histórico perde a referência (nome do exercício, etc.).

Duas alternativas discutidas, **nenhuma decidida ainda**:

1. **Terminar o soft-delete**: mudar `removeExercise` para popular `deleted_at` em vez de `destroyPermanently`. O `WorkoutExercise` nunca é removido fisicamente, só sai das listagens ativas — sessões antigas mantêm FK válida. Escopo maior: mexe em uma feature já em produção/testada.
2. **Snapshotar no momento do registro**: `WorkoutSessionSet` (ou uma tabela auxiliar) guarda uma cópia do nome do exercício (e o que mais for exibido no histórico) no momento em que o set é concluído. Não mexe no delete existente; duplica dado, mas "nome congelado no momento do treino" é um comportamento correto para um histórico (mesmo que o exercício mude de nome depois, a sessão antiga reflete o que foi treinado naquele dia).

Inclinação durante a conversa: opção 2, por não reabrir uma feature já estável — mas ficou como ponto em aberto para decisão futura, não travado.

## Próximos passos sugeridos

- [ ] UI: adicionar botão "Finalizar treino" (ainda não existe) e alguma forma de "descartar/cancelar treino"
- [ ] Decidir o ponto em aberto do `workoutExerciseId` órfão antes de implementar (ou aceitar risco conhecido e revisitar depois)
- [ ] Migration nova (WatermelonDB): tabelas `workout_sessions` e `workout_session_sets` — usar skill `create-watermelon-migration`
- [ ] Formalizar em spec (`refine-spec`) antes de rodar `tdd-orchestrator`, dado o volume de peças novas (2 tabelas, migration, use cases, lógica de resume, dois gatilhos de conclusão)
