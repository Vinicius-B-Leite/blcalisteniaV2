# Technical Specification: WorkoutSession Dinâmica

## 1. Visão Geral

A tela `WorkoutSession` hoje exibe dados 100% hardcoded (nome do treino, exercício, grupo muscular, séries/reps, cronômetros). Esta tarefa torna a tela dinâmica: ela passa a receber `workoutId` via rota (`expo-router`) e buscar do banco (WatermelonDB) o treino e o primeiro exercício com suas séries reais.

**Escopo confirmado (fechado com o usuário):**

- ✅ Buscar e exibir dados reais: título do treino, nome do exercício em foco, grupo(s) muscular(es), lista de séries com reps reais.
- ❌ **Fora de escopo**: qualquer lógica funcional dos botões de ação (`+10 segundos`, `Pular descanso`, `Concluir série`, `Editar exercício`), do timer de descanso (`01:30`) e do cronômetro total (`00:48`). Esses elementos continuam exatamente como estão hoje — visuais, estáticos, sem handlers reais. Não existe conceito de "sessão em andamento" persistido no banco (não há tabela/domain para isso) — isso fica para uma tarefa futura.
- ❌ **Fora de escopo**: navegação entre exercícios ou entre séries. A tela sempre foca o **primeiro exercício** da lista (`exercisesWithSets[0]`).

## 2. Localização e Estrutura

Rota já existe e já é dinâmica — nenhuma mudança de roteamento necessária:

- `src/app/(application)/workout/[workoutId]/session.tsx` → renderiza `<WorkoutSession />` (sem alterações)

Único ponto de entrada, já implementado: `WorkoutDetail` → botão "Começar treino" → `useWorkoutDetail.ts` (`handleStartWorkout`) já faz `router.push({ pathname: "/(application)/workout/[workoutId]/session", params: { workoutId } })`. Esse botão só aparece quando o treino tem ao menos 1 exercício (`hasExercises`), então o caminho normal nunca chega em `WorkoutSession` com um treino vazio — o empty state (seção 4) cobre o caso de borda (deep link direto, ou exercícios removidos enquanto a tela está aberta).

### Arquivos a criar

- [ ] `src/ui/screens/WorkoutSession/useWorkoutSession.ts`
- [ ] `src/ui/screens/WorkoutSession/constants.ts`
- [ ] `src/ui/screens/WorkoutSession/components/FocusedExercise/types.ts`
- [ ] `src/ui/screens/WorkoutSession/components/LoadingState/LoadingState.tsx` + `styles.ts` + `index.ts`
- [ ] `src/ui/screens/WorkoutSession/components/EmptyState/EmptyState.tsx` + `styles.ts` + `types.ts` + `index.ts`
- [ ] `src/ui/screens/WorkoutSession/components/index.ts` (barrel)
- [ ] `src/ui/screens/WorkoutSession/__mocks__/workoutSessionMocks.ts`
- [ ] `src/ui/screens/WorkoutSession/__tests__/WorkoutSession.tsx`

### Arquivos a modificar

- [ ] `src/ui/screens/WorkoutSession/WorkoutSession.tsx` — usa `useWorkoutSession`, renderiza loading/empty/conteúdo, título real no Header, passa props reais para `FocusedExercise`
- [ ] `src/ui/screens/WorkoutSession/components/FocusedExercise/FocusedExercise.tsx` — deixa de ter dados hardcoded, vira componente de apresentação pura (recebe props)

### Nenhuma mudança em Domain ou Infra

Toda a infraestrutura de dados já existe e será 100% reaproveitada:

- `useGetWorkoutById({ id, onError })` — `src/domain/Workout/useCases/useGetWorkoutById.ts`
- `useGetExercisesWithSetsByWorkout(workoutId)` — `src/domain/WorkoutExercise/useCases/useGetWorkoutExercisesWithSets.ts`

Nenhum novo método de repositório, query key ou migration do WatermelonDB é necessário.

## 3. Fluxos do Usuário

### 3.1 Happy Path

1. Usuário está em `WorkoutDetail` de um treino com ao menos 1 exercício.
2. Usuário toca em "Começar treino" → navega para `/(application)/workout/[workoutId]/session` passando `workoutId` (já implementado).
3. `WorkoutSession` lê `workoutId` via `useLocalSearchParams<{ workoutId: string }>()`.
4. Enquanto os dados carregam, exibe `LoadingState` (seção 4).
5. Após carregar: Header mostra `workout.title` real; `FocusedExercise` mostra o primeiro exercício (`exercisesWithSets[0]`) com nome real, grupo(s) muscular(es) traduzido(s) e lista de séries com reps reais.
6. Indicador de progresso (pontinhos) mostra um ponto por exercício do treino (`exercisesWithSets.length`), com o primeiro sempre ativo.
7. Botões de ação, timer de descanso e cronômetro total permanecem estáticos (fora de escopo).

### 3.2 Fluxos Alternativos

- **Voltar**: `Header.GoBack` (comportamento padrão do expo-router, sem mudanças) — leva de volta ao `WorkoutDetail`.
- **Treino não encontrado / erro ao buscar**: dispara toast de erro (via `handleError`, já embutido em `useGetWorkoutById`) e chama `router.back()` — mesmo padrão usado em `useWorkoutDetail.ts`.
- **Treino sem exercícios** (edge case, ver seção 7): exibe `EmptyState` dedicado em vez de `FocusedExercise`.

## 4. Estados da UI

| Estado                                | Comportamento                                                                                                                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loading**                            | Enquanto `useGetWorkoutById` ou `useGetExercisesWithSetsByWorkout` estão carregando, renderiza `<LoadingState />` de tela cheia (Header com título placeholder + `Skeleton` mimetizando o layout do `FocusedExercise`), mesmo padrão do `WorkoutDetail/components/LoadingState`. |
| **Not found / Erro**                   | Se `getWorkoutById` falhar (ex: 404 "Treino não encontrado"), dispara toast de erro automático (`handleError`) e `router.back()`. Nenhuma UI de erro dedicada — mesmo padrão do `useWorkoutDetail`.              |
| **Empty (treino sem exercícios)**      | Se `exercisesWithSets` vier vazio após carregar, renderiza `<EmptyState workoutTitle={workout.title} />` dedicado: mantém `Header.Root` com `Header.GoBack` + `workout.title` real, e a mensagem fixa "Este treino ainda não tem exercícios" (título) + "Adicione exercícios ao treino para começar a sessão." (descrição), no lugar do `FocusedExercise`/`Actions`. |
| **Conteúdo carregado**                 | Renderiza a tela normalmente com dados reais (ver seção 3.1).                                                                                                                                                    |
| **Paginação / Otimista / Read-only**   | Não aplicável — tela somente leitura, sem paginação.                                                                                                                                                             |

## 5. Definição do Formulário e Validação

Não aplicável — esta tela não possui formulário nem input de usuário. É uma tela somente leitura.

## 6. Fluxo de Estado e Persistência

- Dados vêm diretamente do WatermelonDB local via os use cases já existentes; não há mutation, não há escrita.
- Não existe estado de "sessão em andamento" persistido — reabrir a tela sempre refaz o fetch a partir do banco (mesmo comportamento de qualquer outra tela do tipo "detail").
- Cronômetro total (`00:48`) e timer de descanso (`01:30`) continuam como texto estático — não são derivados de nenhum dado real nem de um relógio local.

## 7. Regras de Negócio e Edge Cases

| Cenário                                                                                      | Comportamento                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workoutId` ausente/vazio na rota                                                             | `useGetWorkoutById` usa `enabled: !!id` (já existente) — query não dispara; tela permanece em loading até um `workoutId` válido chegar via rota (não deve ocorrer na navegação normal). |
| `workoutId` não existe no banco                                                               | `getWorkoutById` lança `AppError` (404 "Treino não encontrado") → toast de erro + `router.back()`.                                                                             |
| Treino existe mas sem exercícios (`exercisesWithSets.length === 0`)                            | Exibe `EmptyState` dedicado (ver seção 4) — não tenta renderizar `FocusedExercise` sem dados.                                                                                   |
| Exercício focado tem múltiplos grupos musculares (`musclesGroups.length > 1`)                  | Exibe todos, traduzidos via `MUSCLES_GROUP_LABELS`, separados por vírgula. Ex: `["chest", "triceps"]` → `"Peitoral, Tríceps"`.                                                  |
| Exercício focado tem mais de 3 séries                                                          | Lista de séries vira `ScrollView` horizontal (ver bug corrigido abaixo).                                                                                                        |
| Treino tem mais de 1 exercício                                                                 | Indicador de pontinhos mostra `exercisesWithSets.length` pontos, primeiro sempre ativo (não há navegação real entre exercícios neste escopo).                                  |
| Ordem dos exercícios/séries                                                                    | Segue a mesma ordem retornada pela query (mesma ordem já usada em `WorkoutDetail`) — sem lógica de ordenação adicional.                                                          |

### ⚠️ Bug corrigido: `exerciseCount` conflava dois conceitos diferentes

No código atual, a mesma variável `exerciseCount` (hardcoded em 6) controla **dois comportamentos diferentes** em `FocusedExercise.tsx`:

1. Quantidade de pontinhos indicadores de progresso entre exercícios do treino.
2. Se a lista de **séries** do exercício em foco vira `ScrollView` horizontal (`exerciseCount > 3`) e a largura da linha conectora (`exerciseCount > 3 && { width: 70 }`).

**Decisão confirmada**: separar os dois conceitos.

- `exerciseCount` (prop) = `exercisesWithSets.length` → controla **somente** os pontinhos indicadores.
- Um novo valor derivado internamente, `setsCount = sets.length` (do exercício focado) → controla o `ScrollView` horizontal e a largura da linha conectora da lista de séries.

## 8. Decisões de Arquitetura

### Domain

Nenhuma mudança. Reaproveita integralmente:

- `WorkoutModel` (`src/domain/Workout/WorkoutModel.ts`)
- `ExerciseWithWorkoutSetsModel` (`src/domain/WorkoutExercise/WorkoutExerciseModel.ts`) — `ExerciseModel & { workoutExerciseId: string, sets: WorkoutExerciseSetModel[] }`
- `WorkoutExerciseSetModel` (`src/domain/WorkoutExerciseSet/WorkoutExerciseSetModel.ts`) — `{ id, workoutExerciseId, reps, rest }`
- `useGetWorkoutById({ id, onError })`
- `useGetExercisesWithSetsByWorkout(workoutId)`

### Infra

Nenhuma mudança. Nenhum novo método de repo, query key, tabela ou migration do WatermelonDB.

### UI

**`useWorkoutSession.ts`** — segue exatamente o padrão de `useWorkoutDetail.ts`:

```typescript
export const useWorkoutSession = () => {
	const router = useRouter()
	const { workoutId } = useLocalSearchParams<{ workoutId: string }>()

	const { workout, isLoading: isWorkoutLoading } = useGetWorkoutById({
		id: workoutId,
		onError: () => router.back(),
	})

	const { exercisesWithSets, isLoading: isExercisesLoading } =
		useGetExercisesWithSetsByWorkout(workoutId)

	const focusedExercise = exercisesWithSets[0]
	const hasExercises = exercisesWithSets.length > 0

	return {
		state: {
			workout,
			focusedExercise,
			exerciseCount: exercisesWithSets.length,
			hasExercises,
			isLoading: isWorkoutLoading || isExercisesLoading,
		},
	}
}
```

**`WorkoutSession.tsx`** — passa a ser tela fina:

```typescript
export const WorkoutSession = () => {
	const { state } = useWorkoutSession()

	if (state.isLoading) return <LoadingState />
	if (!state.workout) return null
	if (!state.hasExercises) return <EmptyState workoutTitle={state.workout.title} />

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.HorizontalCenterTitle testID={WORKOUT_SESSION_SCREEN_TEST_IDS.WORKOUT_TITLE}>
					{state.workout.title}
				</Header.HorizontalCenterTitle>
			</Header.Root>

			{/* sessionTimer e Actions permanecem exatamente como estão hoje */}

			<FocusedExercise
				exerciseName={state.focusedExercise.name}
				muscleGroupLabel={state.focusedExercise.musclesGroups
					.map((g) => MUSCLES_GROUP_LABELS[g])
					.join(", ")}
				sets={state.focusedExercise.sets}
				exerciseCount={state.exerciseCount}
			/>
			<Actions />
		</Screen>
	)
}
```

**`FocusedExercise.tsx`** — componente de apresentação pura, recebe props via `types.ts`:

```typescript
// components/FocusedExercise/types.ts
export type FocusedExerciseProps = {
	exerciseName: string
	muscleGroupLabel: string
	sets: WorkoutExerciseSetModel[]
	exerciseCount: number
}
```

> Nota: não existe prop `exerciseIndex`. Como a navegação entre exercícios está fora de escopo (seção 1), o exercício em foco é sempre o índice 0 — isso fica hardcoded internamente no indicador de pontinhos (`isActive(i) = i === 0`), sem expor uma prop que hoje não teria nenhum outro valor possível. Se a navegação entre exercícios for implementada em uma tarefa futura, essa prop pode ser reintroduzida naquele momento.

- `Summary`: usa `exerciseName` e `muscleGroupLabel` diretamente.
- Indicador de pontinhos: itera `exerciseCount`, `isActive(i) = i === 0`.
- Lista de séries: itera `sets` (`sets.map((set, i) => <SerieItem serie={i + 1} reps={set.reps} hasNext={i < sets.length - 1} />)`).
- `setsCount = sets.length` controla o `ScrollView` horizontal (`setsCount > 3`) e a largura da linha conectora — **não** mais `exerciseCount` (ver bug corrigido, seção 7).
- Contagem de séries exibida (“1 de N séries”): `N = sets.length`; o "1" permanece fixo, já que não há navegação/avanço de série neste escopo.

**`LoadingState`** — novo componente em `components/`, seguindo exatamente o padrão de `WorkoutDetail/components/LoadingState`: `Screen` + `Header.Root` (com `Header.GoBack` + título placeholder estático, ex: "Sessão de treino", já que `workout.title` ainda não carregou) + `Skeleton`s mimetizando o layout do `FocusedExercise`. Não recebe props.

**`EmptyState`** — novo componente em `components/`, com uma estrutura diferente do `WorkoutDetail/components/EmptyState` (que não tem Header nem props, pois é usado como `ListEmptyComponent` de uma lista cujo Header já existe no componente pai). Aqui o `EmptyState` substitui a tela inteira, então ele **precisa** ter seu próprio `Header.Root` (`Header.GoBack` + título real) — a mesma estrutura do `LoadingState`, não a do `EmptyState` do `WorkoutDetail`. Contrato de props:

```typescript
// components/EmptyState/types.ts
export type EmptyStateProps = {
	workoutTitle: string
}
```

Conteúdo: `Header.Root` com `Header.GoBack` + `Header.HorizontalCenterTitle` (`workoutTitle`), seguido de mensagem fixa — título "Este treino ainda não tem exercícios" + descrição "Adicione exercícios ao treino para começar a sessão." (mesmo padrão visual de título+descrição do `EmptyState` do `WorkoutDetail`, só que com Header próprio).

### Navegação

Nenhuma mudança — rota já existe e já é dinâmica (`[workoutId]/session.tsx`).

## 9. Plano de Testes

### testIDs necessários (`WorkoutSession/constants.ts`)

```typescript
const prefix = "workout-session-screen"

export const WORKOUT_SESSION_SCREEN_TEST_IDS = {
	LOADING_STATE: `${prefix}-loading-state`,
	EMPTY_STATE: `${prefix}-empty-state`,
	WORKOUT_TITLE: `${prefix}-workout-title`,
	EXERCISE_NAME: `${prefix}-exercise-name`,
	MUSCLE_GROUP: `${prefix}-muscle-group`,
	EXERCISE_INDICATOR: `${prefix}-exercise-indicator`, // estático, um por pontinho — usar queryAllByTestId para contar
	SET_ITEM: `${prefix}-set-item`, // estático, um por série — usar queryAllByTestId para contar
	SET_ITEM_REPS: `${prefix}-set-item-reps`, // estático, um por série — checar .props.children por índice
}
```

### Setup/Teardown padrão

```typescript
const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mocked(useRouter).mockReturnValue({ push: mockPush, back: mockBack } as unknown as Router)

beforeEach(async () => {
	await asTestableRepository(WorkoutRepo).clear()
	await asTestableRepository(WorkoutExerciseRepo).clear()
	queryClient.clear()
	jest.clearAllMocks()
	jest.mocked(useRouter).mockReturnValue({ push: mockPush, back: mockBack } as unknown as Router)
	jest.mocked(useLocalSearchParams).mockReturnValue({ workoutId: workoutSessionMocks.workout.id })
	await asTestableRepository(WorkoutRepo).seed([workoutSessionMocks.workout])
})
```

### Cenários obrigatórios

| # | Cenário | Setup | Assertion |
|---|---------|-------|-----------|
| 1 | Loading state ao iniciar | nenhum seed de exercícios ainda | `getByTestId(LOADING_STATE)` presente imediatamente após `render` |
| 2 | Empty state quando treino não tem exercícios | seed do workout, sem `WorkoutExercise` | `findByTestId(EMPTY_STATE)` presente; `queryByTestId(EXERCISE_NAME)` ausente |
| 3 | Renderiza dados reais do primeiro exercício | seed workout + 2 `exercisesWithSets` (ex: "Flexão de braço" com 3 sets, "Supino" com 2 sets) | `findByTestId(EXERCISE_NAME).props.children === "Flexão de braço"`; `queryAllByTestId(SET_ITEM).length === 3` |
| 4 | Grupo muscular único | exercício focado com `musclesGroups: ["chest"]` | `findByTestId(MUSCLE_GROUP).props.children === "Peitoral"` |
| 5 | Múltiplos grupos musculares | exercício focado com `musclesGroups: ["chest", "triceps"]` | `findByTestId(MUSCLE_GROUP).props.children === "Peitoral, Tríceps"` |
| 6 | Reps reais por série | exercício focado com sets `[{reps: 12}, {reps: 8}]` | `getAllByTestId(SET_ITEM_REPS)[0].props.children` reflete `12`; `[1]` reflete `8` |
| 7 | Indicador de progresso reflete número de exercícios do treino | seed 3 `exercisesWithSets` | `queryAllByTestId(EXERCISE_INDICATOR).length === 3` |
| 8 | Título do treino real no Header | seed `workout.title = "Treino de Força"` | `findByTestId(WORKOUT_TITLE).props.children === "Treino de Força"` |
| 9 | Erro / treino não encontrado | `useLocalSearchParams` retorna um `workoutId` que não existe no repo (não seedado) | `router.back` (`mockBack`) chamado; toast de erro renderizado (`TOAST_ROOT_TEST_ID`) |

**Fora do plano de testes** (explicitamente fora de escopo, não devem gerar testes falhando): botões de ação (`+10 segundos`, `Pular descanso`, `Concluir série`, `Editar exercício`), timer de descanso (`01:30`) e cronômetro total (`00:48`) — permanecem estáticos, sem handlers, sem asserts de comportamento.

### Mocks (`__mocks__/workoutSessionMocks.ts`)

Seguir exatamente o padrão de `WorkoutDetail/__mocks__/workoutDetailMocks.ts`: um `WorkoutModel` fixo + um array de `ExerciseWithWorkoutSetsModel` (nome, `musclesGroups`, `workoutExerciseId`, `sets` com `reps`/`rest`) cobrindo os casos de 1 e múltiplos grupos musculares, e exercícios com diferentes quantidades de séries (incluindo um caso com mais de 3 séries, para exercitar o `ScrollView` horizontal do bug corrigido).
