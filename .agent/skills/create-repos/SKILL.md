---
name: create-repos
description: Creates repository layer following Clean Architecture principles with TypeScript, Context API, adapters pattern, and WatermelonDB integration. Repositories implement domain interfaces and handle data persistence. Use when creating new data repositories, implementing data access layers, or when the user asks about repository architecture.
---

# Creating Repositories (Repo Layer)

This skill guides the creation of repository layers following Clean Architecture principles and the project's established conventions.

## Technologies & Stack

- **Clean Architecture** (Domain-driven design)
- **TypeScript** for type safety
- **React Context API** for dependency injection
- **WatermelonDB** for local database persistence
- **Adapter Pattern** for data transformation
- **Repository Pattern** for data access abstraction

## Architecture Overview

The repository layer sits between the domain and infrastructure layers, providing:

- **Data access abstraction**: Domain doesn't know about database implementation
- **Data transformation**: Database models ↔ Domain models
- **Dependency injection**: Repositories provided via React Context
- **Query keys management**: Centralized cache keys for React Query

## Repository Structure

### File Organization

Each repository follows a consistent 4-file structure within `src/infra/repos/[EntityName]/`:

```
EntityName/
├── EntityNameRepo.ts          # Repository implementation
├── EntityNameAdapters.ts      # Data transformation (DB ↔ Domain)
├── EntityNameQueryKeys.ts     # React Query cache keys
└── EntityNameRepoProvider.tsx # Context provider and hook
```

### Example: User Repository Structure

```
User/
├── UserRepo.ts          # Implements IUserRepo interface
├── UserAdapters.ts      # Transforms between UsersModel and UserModel
├── UserQueryKeys.ts     # Query keys: getCurrentUser, getUsers, etc.
└── UserRepoProvider.tsx # Provides UserRepo via Context API
```

## Step-by-Step Creation

### 1. Domain Layer (Prerequisites)

Before creating a repository, ensure the domain layer exists:

**Domain Model (`src/domain/EntityName/EntityNameModel.ts`):**

```typescript
// src/domain/User/UserModel.ts
export type UserModel = {
	id: string
	name: string
	email: string
	createdAt: Date
}
```

**Domain Interface (`src/domain/EntityName/IEntityNameRepo.ts`):**

```typescript
// src/domain/User/IUserRepo.ts
import { UserModel } from "./UserModel"

export interface IUserRepo {
	getAll(): Promise<UserModel[]>
	getById(id: string): Promise<UserModel | null>
	create(params: Omit<UserModel, "id">): Promise<UserModel>
	update(id: string, params: Partial<UserModel>): Promise<UserModel>
	delete(id: string): Promise<void>
}
```

**Key points:**

- Interface defines the contract (use cases don't know implementation details)
- Methods return domain models, not database models
- Use `Promise<T>` for all async operations
- Use descriptive method names (getAll, getById, create, update, delete)

### 2. Adapters File

Create adapters to transform between database models and domain models:

```typescript
// src/infra/repos/EntityName/EntityNameAdapters.ts
import { EntityNameModel } from "src/domain/EntityName/EntityNameModel"
import EntityNamesModel from "src/infra/database/watermelon/models/EntityNamesModel"

export const entityNameAdapters = {
	toDomain: (data: EntityNamesModel): EntityNameModel => ({
		id: data.id,
		name: data.name,
		email: data.email,
		createdAt: new Date(data.createdAt),
	}),

	toDTO: (data: EntityNameModel): Partial<EntityNamesModel> => ({
		name: data.name,
		email: data.email,
		createdAt: data.createdAt.getTime(),
	}),
}
```

**Naming conventions:**

- Export as `entityNameAdapters` (camelCase, singular)
- Two methods: `toDomain` (DB → Domain) and `toDTO` (Domain → DB)
- `toDomain`: transforms database model to domain model (full object)
- `toDTO`: transforms domain model to database model (Partial, excludes id)

**Transformation rules:**

- Handle data type conversions (timestamps, JSON strings, etc.)
- Parse complex types (JSON → objects/arrays)
- Include all domain-relevant fields
- `toDTO` returns `Partial` because id is auto-generated

**Common transformations:**

```typescript
// JSON string to object/array
weekDaysFrequency: JSON.parse(data.weekDaysFrequency) as WeekDaysFrequency[]

// Object/array to JSON string
weekDaysFrequency: JSON.stringify(data.weekDaysFrequency)

// Timestamp to Date
createdAt: new Date(data.createdAt)

// Date to timestamp
createdAt: data.createdAt.getTime()

// Constants mapping
category: CATEGORIES[data.category as keyof typeof CATEGORIES]
```

### 3. Repository Implementation

Implement the domain interface with database operations:

```typescript
// src/infra/repos/EntityName/EntityNameRepo.ts
import { IEntityNameRepo } from "src/domain/EntityName/IEntityNameRepo"
import { database } from "src/infra/database"
import EntityNamesModel from "src/infra/database/watermelon/models/EntityNamesModel"
import { entityNameAdapters } from "./EntityNameAdapters"
import { AppError } from "@/errors"

export const EntityNameRepo: IEntityNameRepo = {
	getAll: async () => {
		try {
			const items = await database.collections
				.get<EntityNamesModel>("entity_names")
				.query()
				.fetch()

			return items.map(entityNameAdapters.toDomain)
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new AppError({
				message: "Ocorreu um erro ao buscar as entidades",
				property: "entity",
				statusCode: 500,
			})
		}
	},

	getById: async (id) => {
		try {
			const item = await database.collections
				.get<EntityNamesModel>("entity_names")
				.find(id)

			return entityNameAdapters.toDomain(item)
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new AppError({
				message: "Entidade não encontrada",
				property: "entity",
				statusCode: 404,
			})
		}
	},

	create: async (params) => {
		try {
			let createdItem: EntityNamesModel | null = null

			await database.write(async () => {
				createdItem = await database
					.get<EntityNamesModel>("entity_names")
					.create((item) => {
						Object.assign(
							item,
							entityNameAdapters.toDTO({
								...params,
								id: "", // id will be auto-generated
							}),
						)
					})
			})

			return entityNameAdapters.toDomain(createdItem!)
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new AppError({
				message: "Ocorreu um erro ao criar a entidade",
				property: "entity",
				statusCode: 500,
			})
		}
	},

	update: async (id, params) => {
		try {
			let updatedItem: EntityNamesModel | null = null

			await database.write(async () => {
				const item = await database.get<EntityNamesModel>("entity_names").find(id)

				updatedItem = await item.update((record) => {
					Object.assign(
						record,
						entityNameAdapters.toDTO({
							...params,
							id,
						} as EntityNameModel),
					)
				})
			})

			return entityNameAdapters.toDomain(updatedItem!)
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new AppError({
				message: "Ocorreu um erro ao atualizar a entidade",
				property: "entity",
				statusCode: 500,
			})
		}
	},

	delete: async (id) => {
		try {
			await database.write(async () => {
				const item = await database.get<EntityNamesModel>("entity_names").find(id)

				await item.destroyPermanently()
			})
		} catch (error) {
			if (error instanceof AppError) throw error
			throw new AppError({
				message: "Ocorreu um erro ao deletar a entidade",
				property: "entity",
				statusCode: 500,
			})
		}
	},
}
```

**Key patterns:**

- Export as constant: `export const EntityNameRepo: IEntityNameRepo`
- Each method implements the interface method signature
- Import `database` from `src/infra/database`
- Use `database.collections.get<Model>("table_name")` to access collections
- Table name is plural and snake_case: `"entity_names"`

**WatermelonDB patterns:**

**READ operations (no write wrapper):**

```typescript
// Query all
const items = await database.collections.get<Model>("table").query().fetch()

// Find by id
const item = await database.collections.get<Model>("table").find(id)

// Query with conditions
const items = await database.collections
	.get<Model>("table")
	.query(Q.where("field", "value"))
	.fetch()
```

**WRITE operations (require database.write):**

```typescript
// Create
await database.write(async () => {
	createdItem = await database.get<Model>("table").create((record) => {
		record.field1 = value1
		record.field2 = value2
		// Or use Object.assign with adapter
	})
})

// Update
await database.write(async () => {
	const item = await database.get<Model>("table").find(id)
	await item.update((record) => {
		record.field = newValue
	})
})

// Delete
await database.write(async () => {
	const item = await database.get<Model>("table").find(id)
	await item.destroyPermanently()
})
```

**Data transformation:**

- Always use adapters: `items.map(adapters.toDomain)`
- For single items: `adapters.toDomain(item)`
- When creating/updating: use `adapters.toDTO(domainModel)`

**Error handling (Watermelon + InMemory):**

- Sempre importe `AppError` de `@/errors`
- Use `AppError` em vez de `throw new Error(...)` — assim a mensagem chega corretamente até o toast via `handleError`
- **Re-throw obrigatório**: `if (error instanceof AppError) throw error` antes do fallback genérico. Sem isso, um `AppError` 404 ("não encontrado") é substituído pelo genérico 500
- Operações de **leitura** que não encontram o item: lançar `AppError` com `statusCode: 404`
- Operações de **escrita** com falha inesperada: lançar `AppError` com `statusCode: 500`
- **Nunca use operação silenciosa** (`if (index !== -1) splice`) sem throw no else — isso impede testes de erro sem mock

### 4. Query Keys

Define React Query cache keys for the repository:

```typescript
// src/infra/repos/EntityName/EntityNameQueryKeys.ts
export const entityNameQueryKeys = {
	all: ["entity-names"] as const,
	lists: () => [...entityNameQueryKeys.all, "list"] as const,
	list: (filters: string) => [...entityNameQueryKeys.lists(), { filters }] as const,
	details: () => [...entityNameQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...entityNameQueryKeys.details(), id] as const,
}
```

**Naming conventions:**

- Export as `entityNameQueryKeys` (camelCase, plural in keys)
- Use `as const` for type safety
- Hierarchical structure for easy invalidation

**Query key patterns:**

**Simple pattern (for small entities):**

```typescript
export const entityNameQueryKeys = {
	getCurrentUser: "getCurrentUser",
	getUsers: "getUsers",
} as const
```

**Hierarchical pattern (for complex entities):**

```typescript
export const entityNameQueryKeys = {
	all: ["entity-names"] as const,
	lists: () => [...entityNameQueryKeys.all, "list"] as const,
	list: (filters: string) => [...entityNameQueryKeys.lists(), { filters }] as const,
	details: () => [...entityNameQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...entityNameQueryKeys.details(), id] as const,
}
```

**Benefits of hierarchical structure:**

- Invalidate all: `queryClient.invalidateQueries(entityNameQueryKeys.all)`
- Invalidate all lists: `queryClient.invalidateQueries(entityNameQueryKeys.lists())`
- Invalidate specific: `queryClient.invalidateQueries(entityNameQueryKeys.detail(id))`

### 5. Repository Provider

Create Context provider for dependency injection:

```typescript
// src/infra/repos/EntityName/EntityNameRepoProvider.tsx
import { createContext, useContext } from "react"
import { IEntityNameRepo } from "src/domain/EntityName/IEntityNameRepo"

const EntityNameRepoContext = createContext({} as IEntityNameRepo)

export const EntityNameRepoProvider = EntityNameRepoContext.Provider

export const useEntityNameRepo = () => {
	const context = useContext(EntityNameRepoContext)
	if (!context) {
		throw new Error("useEntityNameRepo must be used within an EntityNameRepoProvider")
	}
	return context
}
```

**Naming conventions:**

- Context: `EntityNameRepoContext` (singular, PascalCase)
- Provider: `EntityNameRepoProvider` (export the Context.Provider)
- Hook: `useEntityNameRepo` (camelCase, singular)

**Key points:**

- Context typed as domain interface: `IEntityNameRepo`
- Provider is just `Context.Provider` exported
- Hook throws error if used outside provider (safety check)
- Error message is descriptive: "must be used within..."

### 6. Integration

#### 6.1. Update ReposProviders

Add the new repository to the providers tree:

```typescript
// src/infra/repos/ReposProviders.tsx
import { AuthRepo } from "./Auth/AuthRepo"
import { AuthRepoProvider } from "./Auth/AuthRepoProvider"
import { WorkoutRepo } from "./Workout/WorkoutRepo"
import { WorkoutRepoProvider } from "./Workout/WorkoutRepoProvider"
import { EntityNameRepo } from "./EntityName/EntityNameRepo"
import { EntityNameRepoProvider } from "./EntityName/EntityNameRepoProvider"

export const ReposProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<WorkoutRepoProvider value={WorkoutRepo}>
			<AuthRepoProvider value={AuthRepo}>
				<EntityNameRepoProvider value={EntityNameRepo}>
					{children}
				</EntityNameRepoProvider>
			</AuthRepoProvider>
		</WorkoutRepoProvider>
	)
}
```

**Pattern:**

- Nest providers (order doesn't matter for independent repos)
- Pass concrete implementation as `value` prop
- Wrap all providers around `{children}`

#### 6.2. Update Index Exports

Export the hook and query keys from the central index:

```typescript
// src/infra/repos/index.ts
export * from "./ReposProviders"

export { useAuthRepo } from "./Auth/AuthRepoProvider"
export { useWorkoutRepo } from "./Workout/WorkoutRepoProvider"
export { useEntityNameRepo } from "./EntityName/EntityNameRepoProvider"

export { authQueryKeys } from "./Auth/AuthQueryKeys"
export { workoutQueryKeys } from "./Workout/WorkoutQueryKeys"
export { entityNameQueryKeys } from "./EntityName/EntityNameQueryKeys"
```

**Pattern:**

- Export all providers with wildcard
- Export each hook individually (named export)
- Export each query keys individually (named export)
- Maintain alphabetical order for readability

## Usage in Domain Layer (Use Cases)

Use the repository in domain use cases via custom hooks:

```typescript
// src/domain/EntityName/useCases/useGetEntityNames.ts
import { useAppQuery } from "src/hooks/useAppQuery"
import { useEntityNameRepo, entityNameQueryKeys } from "src/infra/repos"

export const useGetEntityNames = () => {
	const entityNameRepo = useEntityNameRepo()

	return useAppQuery({
		queryKey: entityNameQueryKeys.all,
		queryFn: () => entityNameRepo.getAll(),
	})
}
```

**For mutations:**

```typescript
// src/domain/EntityName/useCases/useCreateEntityName.ts
import { useAppMutation } from "src/hooks/useAppMutation"
import { useEntityNameRepo, entityNameQueryKeys } from "src/infra/repos"
import { EntityNameModel } from "../EntityNameModel"

export const useCreateEntityName = () => {
	const entityNameRepo = useEntityNameRepo()
	const queryClient = useQueryClient()

	return useAppMutation({
		mutationFn: (params: Omit<EntityNameModel, "id">) =>
			entityNameRepo.create(params),
		onSuccess: () => {
			queryClient.invalidateQueries(entityNameQueryKeys.all)
		},
	})
}
```

## Design Patterns & Principles

### 1. Clean Architecture

**Dependency rule:** Domain doesn't depend on infrastructure

```
Domain (interfaces) ← Infrastructure (implementations)
```

- **Domain layer** (`src/domain/`): Defines interfaces and models
- **Infrastructure layer** (`src/infra/repos/`): Implements interfaces
- **Presentation layer** (`src/ui/`): Uses domain use cases

**Benefits:**

- Database can be swapped without changing domain
- Testable: mock repositories easily
- Clear separation of concerns

### 2. Repository Pattern

**Abstraction over data access:**

```typescript
// Instead of this in components:
const users = await database.get("users").query().fetch()

// Use this:
const { data: users } = useGetUsers()
```

**Benefits:**

- Components don't know about database
- Centralized data access logic
- Easy to add caching, logging, etc.

### 3. Adapter Pattern

**Transforms between layers:**

```
Database Model (infrastructure) ↔ Domain Model (domain)
```

**Example:**

```typescript
// Database stores JSON string
weekDaysFrequency: "[0,1,2]"

// Domain uses typed array
weekDaysFrequency: [0, 1, 2] as WeekDaysFrequency[]
```

**Benefits:**

- Domain works with clean types
- Database optimizations don't affect domain
- Type safety between layers

### 4. Dependency Injection (Context API)

**Provides repository implementations at runtime:**

```typescript
// At app root
<EntityNameRepoProvider value={EntityNameRepo}>
  <App />
</EntityNameRepoProvider>

// In components/hooks
const entityNameRepo = useEntityNameRepo()
```

**Benefits:**

- Easy to swap implementations (testing, mocking)
- No hard-coded dependencies
- Centralized configuration

## Common Patterns & Examples

### Single Entity with Simple Operations

**Example: User with basic CRUD**

```typescript
// Domain interface
export interface IUserRepo {
	getAll(): Promise<UserModel[]>
	getById(id: string): Promise<UserModel | null>
	create(params: Omit<UserModel, "id">): Promise<UserModel>
}

// Query keys
export const userQueryKeys = {
	all: ["users"] as const,
	detail: (id: string) => [...userQueryKeys.all, id] as const,
}
```

### Entity with Relationships

**Example: Workout with exercises**

```typescript
// Domain interface
export interface IWorkoutRepo {
	getWorkoutWithExercises(id: string): Promise<WorkoutWithExercisesModel>
}

// Repository implementation
getWorkoutWithExercises: async (id) => {
	const workout = await database.get<WorkoutsModel>("workouts").find(id)
	const exercises = await workout.exercises.fetch() // WatermelonDB relation

	return {
		...workoutAdapters.toDomain(workout),
		exercises: exercises.map(exerciseAdapters.toDomain),
	}
}
```

### Entity with Complex Queries

**Example: Search/filter operations**

```typescript
// Domain interface
export interface IWorkoutRepo {
	search(query: string): Promise<WorkoutModel[]>
	filterByCategory(category: string): Promise<WorkoutModel[]>
}

// Repository implementation
search: async (query) => {
	const workouts = await database
		.get<WorkoutsModel>("workouts")
		.query(Q.where("title", Q.like(`%${Q.sanitizeLikeString(query)}%`)))
		.fetch()

	return workouts.map(workoutAdapters.toDomain)
},

filterByCategory: async (category) => {
	const workouts = await database
		.get<WorkoutsModel>("workouts")
		.query(Q.where("category", category))
		.fetch()

	return workouts.map(workoutAdapters.toDomain)
}
```

### Authentication Repository

**Example: Singleton user pattern**

```typescript
export interface IAuthRepo {
	getCurrentUser(): Promise<UserModel | null>
	signIn(params: SignInParams): Promise<UserModel>
	logout(): Promise<void>
}

// Implementation
getCurrentUser: async () => {
	const users = await database.get<UsersModel>("users").query().fetch()
	return users.length > 0 ? authAdapters.toDomain(users[0]) : null
},

logout: async () => {
	// Delete all data
	await database.adapter.unsafeResetDatabase()
}
```

## Testing Repositories

**Mock repository for testing:**

```typescript
// tests/mocks/entityNameRepoMock.ts
import { IEntityNameRepo } from "src/domain/EntityName/IEntityNameRepo"

export const entityNameRepoMock: IEntityNameRepo = {
	getAll: jest.fn(),
	getById: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
}
```

**Use in tests:**

```typescript
import { entityNameRepoMock } from "tests/mocks/entityNameRepoMock"

// Setup mock return value
entityNameRepoMock.getAll.mockResolvedValue([mockEntityName])

// Provide mock in tests
<EntityNameRepoProvider value={entityNameRepoMock}>
  <ComponentUnderTest />
</EntityNameRepoProvider>
```

## Checklist for New Repository

- [ ] Domain layer exists:
    - [ ] Model type defined (`EntityNameModel.ts`)
    - [ ] Interface defined (`IEntityNameRepo.ts`)
- [ ] Created `src/infra/repos/EntityName/` directory
- [ ] Created `EntityNameAdapters.ts` with `toDomain` and `toDTO`
- [ ] Created `EntityNameRepo.ts` implementing interface
- [ ] Created `EntityNameQueryKeys.ts` with query keys
- [ ] Created `EntityNameRepoProvider.tsx` with context and hook
- [ ] Updated `ReposProviders.tsx` to include new provider
- [ ] Updated `src/infra/repos/index.ts` with exports
- [ ] Created use cases in `src/domain/EntityName/useCases/`
- [ ] Tested repository operations

## Common Mistakes to Avoid

1. **Don't mix domain and database models**

    ```typescript
    // ❌ Wrong: returning database model
    return workoutsModel

    // ✅ Correct: transform to domain model
    return workoutAdapters.toDomain(workoutsModel)
    ```

2. **Don't forget database.write for mutations**

    ```typescript
    // ❌ Wrong: create without write
    await database.get("table").create(...)

    // ✅ Correct: wrap in write
    await database.write(async () => {
      await database.get("table").create(...)
    })
    ```

3. **Don't use database directly in domain layer**

    ```typescript
    // ❌ Wrong: database in use case
    const workouts = await database.get("workouts").query().fetch()

    // ✅ Correct: use repository
    const workouts = await workoutRepo.getAll()
    ```

4. **Don't forget error handling**

    ```typescript
    // ❌ Wrong: no error handling
    const item = await database.get("table").find(id)

    // ✅ Correct: try-catch with descriptive message
    try {
    	const item = await database.get("table").find(id)
    	return adapters.toDomain(item)
    } catch (error) {
    	throw new Error("Error fetching item: " + error)
    }
    ```

5. **Don't make query keys mutable**

    ```typescript
    // ❌ Wrong: missing 'as const'
    export const queryKeys = {
    	all: ["items"],
    }

    // ✅ Correct: use 'as const' for type safety
    export const queryKeys = {
    	all: ["items"] as const,
    }
    ```

## Summary

**Repository layer provides:**

- Clean separation between domain and infrastructure
- Type-safe data access with TypeScript
- Consistent patterns across all data entities
- Easy testing with dependency injection
- Organized code structure

**Key files for each repository:**

1. `EntityNameRepo.ts` - Implementation
2. `EntityNameAdapters.ts` - Data transformation
3. `EntityNameQueryKeys.ts` - Cache keys
4. `EntityNameRepoProvider.tsx` - Dependency injection

**Follow the patterns consistently for maintainable, scalable code.**
