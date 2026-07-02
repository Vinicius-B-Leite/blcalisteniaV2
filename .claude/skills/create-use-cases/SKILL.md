---
name: create-use-cases
description: Creates use cases (business logic layer) following Clean Architecture principles with TypeScript and React Query abstractions. Use cases orchestrate domain logic and repository calls. Use when creating new business logic, implementing user interactions, or when asked about use case patterns and architecture.
---

# Creating Use Cases

This skill guides the creation of use cases following Clean Architecture principles and the project's established conventions for business logic layer.

## Technologies & Stack

- **Clean Architecture** (Domain-driven design)
- **TypeScript** for type safety
- **React Query** (via `useAppQuery` and `useAppMutation` wrappers)
- **Custom hooks** for reusable business logic
- **Repository Pattern** for data access

## Architecture Overview

Use cases represent the application's business logic and orchestrate:

- **Domain operations**: Execute specific business rules
- **Repository calls**: Fetch or persist data through repository interfaces
- **State management**: Handle loading states and cache with React Query
- **Callbacks**: Provide success/error hooks for UI feedback

## Use Case Types

There are two primary types of use cases based on the operation:

### 1. Query Use Cases (Read Operations)

Used for fetching/reading data using `useAppQuery`.

**Characteristics:**

- Retrieve data from repositories
- Automatic caching and refetching via React Query
- Return `{ data, isLoading }`
- Use query keys for cache management

### 2. Mutation Use Cases (Write Operations)

Used for creating, updating, or deleting data using `useAppMutation`.

**Characteristics:**

- Modify data through repositories
- Handle async operations with loading states
- Return `{ execute, isLoading }`
- `execute` is an async function that triggers the mutation

## File Structure & Location

### Naming Convention

- **File name**: `use[ActionName].ts` (camelCase)
- **Export name**: Same as file name
- **Location**: `src/domain/[EntityName]/useCases/`

### Example Structure

```
src/domain/Auth/useCases/
├── useGetCurrentUser.ts  # Query - fetches current user
├── useSignIn.ts          # Mutation - signs in user
└── useLogout.ts          # Mutation - logs out user

src/domain/Workout/useCases/
├── useGetWorkouts.ts     # Query - fetches workouts
├── useCreateWorkout.ts   # Mutation - creates workout
└── useDeleteWorkout.ts   # Mutation - deletes workout
```

## Query Use Case Pattern

### Basic Template

```typescript
import { useAppQuery } from "src/hooks"
import { [entityQueryKeys], use[EntityName]Repo } from "src/infra/repos"
import { [EntityName]Model } from "../[EntityName]Model"

type Use[ActionName]Params = {
	onSuccess?(data: [ReturnType]): void
	onError?(): void
}

export const use[ActionName] = ({
	onError,
	onSuccess,
}: Use[ActionName]Params = {}) => {
	const [entityName]Repo = use[EntityName]Repo()

	const { isLoading, data } = useAppQuery<[ReturnType]>({
		queryKey: [[entityQueryKeys].[specificKey]],
		queryFn: () => [entityName]Repo.[methodName](),
		onError,
		onSuccess,
	})

	return { isLoading, data }
}
```

### Real Example: useGetCurrentUser

```typescript
import { authQueryKeys, useAuthRepo } from "src/infra/repos"
import { AuthModel } from "../AuthModel"
import { useAppQuery } from "src/hooks"

type UseGetCurrentUserParams = {
	onSuccess?(data: AuthModel): void
	onError?(): void
}

export const useGetCurrentUser = ({
	onError,
	onSuccess,
}: UseGetCurrentUserParams = {}) => {
	const authRepo = useAuthRepo()

	const { isLoading, data } = useAppQuery<AuthModel | null>({
		queryKey: [authQueryKeys.getCurrentUser],
		queryFn: () => authRepo.getCurrentUser(),
		onError,
		onSuccess,
	})

	return { isLoading, data }
}
```

### Real Example: useGetWorkouts

```typescript
import { useAppQuery } from "src/hooks"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"

export const useGetWorkouts = () => {
	const workoutRepo = useWorkoutRepo()

	const { data, isLoading } = useAppQuery({
		queryKey: [workoutQueryKeys.all],
		queryFn: () => workoutRepo.getAllWorkouts(),
	})

	return { workouts: data ?? [], isLoading }
}
```

### Query Use Case Key Points

1. **Import structure:**
    - `useAppQuery` from `src/hooks`
    - Repository hook from `src/infra/repos`
    - Query keys from repository folder
    - Domain model for typing

2. **Parameters:**
    - Optional params object with `onSuccess` and `onError` callbacks
    - Default to empty object `= {}`

3. **Repository access:**
    - Get repo instance via hook: `use[EntityName]Repo()`

4. **useAppQuery configuration:**
    - `queryKey`: Array with query keys for cache management
    - `queryFn`: Arrow function calling repo method
    - `onSuccess`: Callback with typed data
    - `onError`: Error callback

5. **Return value:**
    - Always return object with `isLoading` and `data`
    - Can rename `data` to something more semantic (e.g., `workouts`)
    - Handle null/undefined with fallbacks (`data ?? []`)

## Mutation Use Case Pattern

### Basic Template

```typescript
import { useAppMutation } from "src/hooks"
import { use[EntityName]Repo } from "src/infra/repos"
import { [EntityName]Model } from "../[EntityName]Model"
import { handleError } from "@/utils"

export const use[ActionName] = () => {
	const [entityName]Repo = use[EntityName]Repo()

	const { execute, isLoading } = useAppMutation<[ReturnType], [VariablesType]>({
		mutationFn: (variables) => [entityName]Repo.[methodName](variables),
		onSuccess: () => {
			// invalidar cache, fechar modal, etc.
		},
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao [ação da entidade]")
		},
	})

	return { execute, isLoading }
}
```

### Real Example: useSignIn

```typescript
import { useAppMutation } from "src/hooks"
import { useAuthRepo } from "src/infra/repos"
import { AuthModel } from "../AuthModel"
import { handleError } from "@/utils"

export const useSignIn = () => {
	const authRepo = useAuthRepo()

	const { execute, isLoading } = useAppMutation<AuthModel, { name: string }>({
		mutationFn: (variables) => authRepo.signInAnonymous({ name: variables.name }),
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao fazer login")
		},
	})

	return { execute, isLoading }
}
```

### Real Example: useLogout

```typescript
import { useAppMutation } from "src/hooks"
import { useAuthRepo } from "src/infra/repos"
import { handleError } from "@/utils"

export const useLogout = () => {
	const authRepo = useAuthRepo()

	const { execute, isLoading } = useAppMutation<void, void>({
		mutationFn: authRepo.logout,
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao sair")
		},
	})

	return { execute, isLoading }
}
```

### Mutation Use Case Key Points

1. **Import structure:**
    - `useAppMutation` from `src/hooks`
    - Repository hook from `src/infra/repos`
    - Domain model for typing (if needed)

2. **No parameters:**
    - Mutation use cases typically don't receive params
    - Variables are passed to `execute` function at call time

3. **Repository access:**
    - Get repo instance via hook: `use[EntityName]Repo()`

4. **useAppMutation configuration:**
    - **Generic types**: `<ReturnType, VariablesType>`
        - `ReturnType`: What the mutation returns (e.g., `AuthModel`, `void`)
        - `VariablesType`: Parameters for the mutation (e.g., `{ name: string }`, `void`)
    - `mutationFn`: Function that calls repo method with variables
    - `onError`: Error handler with console.log for debugging
    - `onSuccess`: Optional success callback (not commonly used in examples)

5. **Return value:**
    - Always return `{ execute, isLoading }`
    - `execute` is async and can be called with variables: `await execute({ name: "John" })`

## TypeScript Pattern Guidelines

### Query Use Case Types

```typescript
// Simple query without params
export const useGetAll = () => { ... }

// Query with optional callbacks
type UseGetByIdParams = {
	onSuccess?(data: EntityModel): void
	onError?(): void
}
export const useGetById = (params: UseGetByIdParams = {}) => { ... }

// Query with required params
type UseSearchParams = {
	query: string
	onSuccess?(data: EntityModel[]): void
	onError?(): void
}
export const useSearch = (params: UseSearchParams) => { ... }
```

### Mutation Use Case Types

```typescript
// Mutation with no variables or return
useAppMutation<void, void>

// Mutation with variables, no return
useAppMutation<void, { id: string }>

// Mutation with return and variables
useAppMutation<EntityModel, { name: string; email: string }>

// Mutation with complex variables
type CreateEntityVariables = {
	name: string
	description: string
	categoryId: string
}
useAppMutation<EntityModel, CreateEntityVariables>
```

## Common Patterns & Best Practices

### 1. Error Handling

**Sempre use `handleError` de `@/utils` no `onError` de mutations** — nunca use `console.log`.

```typescript
import { handleError } from "@/utils"

onError: (err) => {
	handleError(err, "Ocorreu um erro ao deletar o treino")
}
```

`handleError` exibe um toast de erro com a mensagem correta:

- Se `err` é `AppError`, usa `err.message` (mensagem específica do repositório, ex: `"Treino não encontrado"`)
- Se é outro tipo de erro, usa o `defaultMessage` fornecido

```typescript
// src/utils/handleError.ts
export const handleError = (error: unknown, defaultMessage: string) => {
	Toast.show({
		variant: "error",
		message: error instanceof AppError ? error.message : defaultMessage,
	})
}
```

**Padrão completo de mutation com tratamento de erro:**

```typescript
import { useAppMutation } from "@/hooks"
import { useEntityRepo, entityQueryKeys } from "@/repos/Entity"
import { useQueryCache } from "@/infra/services"
import { handleError } from "@/utils"

export const useDeleteEntity = () => {
	const entityRepo = useEntityRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<void, string>({
		mutationFn: (id) => entityRepo.deleteEntity(id),
		onSuccess: () => {
			queryCacheService.invalidateCacheSingle([entityQueryKeys.all])
		},
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao deletar a entidade")
		},
	})

	return { execute, isLoading }
}
```

**Mensagem padrão (`defaultMessage`):** deve ser descritiva e no mesmo formato das outras mensagens do app. Será exibida ao usuário somente quando o erro não for um `AppError` — ou seja, erros inesperados. Para `AppError`s lançados pelo repositório (ex: 404 "não encontrado"), a mensagem do `AppError` prevalece.

### 2. Data Transformation

Transform data in the return if needed:

```typescript
return { workouts: data ?? [], isLoading }
// Instead of: return { data, isLoading }
```

### 3. Query Keys Organization

Use centralized query keys from repository folder:

```typescript
// In src/infra/repos/Workout/WorkoutQueryKeys.ts
export const workoutQueryKeys = {
	all: "workouts",
	detail: "workout-detail",
	search: "workout-search",
} as const
```

### 4. Naming Conventions

- **Queries**: `useGet[Entity]`, `useGet[Entities]`, `useSearch[Entity]`
- **Mutations**: `useCreate[Entity]`, `useUpdate[Entity]`, `useDelete[Entity]`, `use[Action]`
- Be specific and descriptive

### 5. Single Responsibility

Each use case should do ONE thing:

- ✅ Good: `useGetCurrentUser`, `useGetUserById`, `useGetAllUsers`
- ❌ Bad: `useGetUser` (ambiguous - which user?)

### 6. Repository Method Calls

Keep use cases thin - business logic should be in repositories or services:

```typescript
// ✅ Good: Direct repository call
mutationFn: (variables) => authRepo.signIn(variables)

// ❌ Bad: Complex logic in use case
mutationFn: async (variables) => {
	const validated = validateUser(variables)
	const hashed = await hashPassword(validated.password)
	return authRepo.signIn({ ...validated, password: hashed })
}
```

## Step-by-Step Creation Checklist

### Before Creating a Use Case

- [ ] Domain model exists (`src/domain/[Entity]/[Entity]Model.ts`)
- [ ] Repository interface exists (`src/domain/[Entity]/I[Entity]Repo.ts`)
- [ ] Repository implementation exists (`src/infra/repos/[Entity]/`)
- [ ] Repository method needed is implemented
- [ ] Query keys are defined (for queries)

### Creating a Query Use Case

1. [ ] Create file: `src/domain/[Entity]/useCases/use[Action].ts`
2. [ ] Import `useAppQuery`, repo hook, query keys, model
3. [ ] Define params type with optional callbacks (if needed)
4. [ ] Get repo instance
5. [ ] Configure `useAppQuery` with correct types
6. [ ] Return `{ data/[semanticName], isLoading }`
7. [ ] Export use case

### Creating a Mutation Use Case

1. [ ] Create file: `src/domain/[Entity]/useCases/use[Action].ts`
2. [ ] Import `useAppMutation`, repo hook, model (if needed)
3. [ ] Get repo instance
4. [ ] Configure `useAppMutation` with generic types
5. [ ] Adicionar `onError` com `handleError(err, "Ocorreu um erro ao [ação]")`
6. [ ] Return `{ execute, isLoading }`
7. [ ] Export use case

## Usage in Components

### Query Use Case Example

```typescript
// In a component
import { useGetWorkouts } from "src/domain/Workout/useCases/useGetWorkouts"

export const WorkoutList = () => {
	const { workouts, isLoading } = useGetWorkouts()

	if (isLoading) return <Loading />

	return (
		<>
			{workouts.map(workout => (
				<WorkoutCard key={workout.id} data={workout} />
			))}
		</>
	)
}
```

### Mutation Use Case Example

```typescript
// In a component
import { useSignIn } from "src/domain/Auth/useCases/useSignIn"

export const LoginForm = () => {
	const { execute, isLoading } = useSignIn()

	const handleSubmit = async (name: string) => {
		try {
			const user = await execute({ name })
			navigation.navigate("Home")
		} catch (err) {
			showToast("Failed to sign in")
		}
	}

	return <Form onSubmit={handleSubmit} loading={isLoading} />
}
```

## Testing Considerations

Use cases should be tested by:

1. **Mocking repositories**: Mock the repo hook to return test data
2. **Testing callbacks**: Verify onSuccess/onError are called correctly
3. **Testing loading states**: Verify isLoading transitions
4. **Testing return values**: Verify correct data structure returned

```typescript
// Example test structure
import { renderHook, waitFor } from "@testing-library/react-hooks"
import { useGetWorkouts } from "./useGetWorkouts"

jest.mock("src/infra/repos/Workout/WorkoutRepoProvider", () => ({
	useWorkoutRepo: () => ({
		getAllWorkouts: jest.fn().mockResolvedValue([mockWorkout1, mockWorkout2]),
	}),
}))

describe("useGetWorkouts", () => {
	it("should fetch workouts", async () => {
		const { result } = renderHook(() => useGetWorkouts())

		expect(result.current.isLoading).toBe(true)

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
			expect(result.current.workouts).toHaveLength(2)
		})
	})
})
```

## Common Mistakes to Avoid

1. ❌ **Don't put business logic in use cases** - Keep them as orchestrators
2. ❌ **Don't mix query and mutation logic** - Use separate use cases
3. ❌ **Don't forget to handle null/undefined** - Provide fallbacks
4. ❌ **Don't hardcode query keys** - Use centralized query keys object
5. ❌ **Don't create use cases without repositories** - Repository must exist first
6. ❌ **Don't use external state management** - React Query handles caching
7. ❌ **Don't forget TypeScript generics** - Always type useAppQuery and useAppMutation

## Summary

Use cases in this project follow a clear, consistent pattern:

- **Query use cases**: Fetch data with `useAppQuery`, return `{ data, isLoading }`
- **Mutation use cases**: Modify data with `useAppMutation`, return `{ execute, isLoading }`
- **Location**: `src/domain/[Entity]/useCases/use[Action].ts`
- **Thin layer**: Just orchestrate repo calls, don't include business logic
- **Type safe**: Always provide proper TypeScript types
- **Consistent naming**: `use[Action][Entity]` following React hooks convention

By following these patterns, use cases remain predictable, testable, and maintainable across the entire application.
