````skill
---
name: create-infra
description: Creates infrastructure layer following Clean Architecture principles with Repository Pattern, Adapter Pattern, and Dependency Injection via React Context. Ensures platform independence and proper separation of concerns between Domain, Infra, and UI layers. Use when creating new repositories, adapters, or integrating external dependencies (APIs, databases, services).
---

# Creating Infrastructure Layer

This skill guides the creation of the infrastructure layer following Clean Architecture principles, ensuring proper abstraction, platform independence, and maintainability.

## Technologies & Stack

- **Clean Architecture** - Separation of concerns with dependency inversion
- **Repository Pattern** - Abstract data access from domain logic
- **Adapter Pattern** - Transform external data formats to domain models
- **React Context API** - Dependency injection for repositories
- **TypeScript** - Type-safe interfaces and implementations
- **Platform Independence** - Same code works on React Native, React, Node.js

## Architecture Overview

```
┌─────────────────────────────────────────┐
│          UI Layer (src/ui)              │  ← External dependencies
│  (Screens, Components, Hooks)           │     (React Native, Expo)
└──────────────┬──────────────────────────┘
               │ depends on ↓
┌──────────────▼──────────────────────────┐
│       Domain Layer (src/domain)         │  ← Pure business rules
│  (Entities, Interfaces, Use Cases)      │     (no external deps)
└──────────────△──────────────────────────┘
               │ implemented by ↓
┌──────────────┴──────────────────────────┐
│       Infra Layer (src/infra)           │  ← Concrete implementations
│  (Repositories, Adapters, APIs)         │     (external libs allowed)
└─────────────────────────────────────────┘
```

## Core Principles

### 1. Dependency Rule
- **Domain** defines interfaces (contracts), never imports from Infra
- **Infra** implements interfaces, can import from Domain
- **UI** depends on Domain interfaces, receives implementations via Context

### 2. Platform Independence
- Infra abstracts platform-specific libs (AsyncStorage, localStorage, etc)
- Same domain/UI code works on multiple platforms
- Platform adapters injected via Context

### 3. Testability
- Mock interfaces for unit tests
- Replace implementations without changing domain/UI
- Isolated changes in infra layer

## Step-by-Step Guide

### Step 1: Define Domain Interface

**Location**: `src/domain/{Feature}/I{Feature}Repo.ts`

**Example**: `src/domain/Workout/IWorkoutRepo.ts`

```typescript
import { WorkoutModel } from './WorkoutModel'

export type CreateWorkoutDTO = {
	title: string
	exercises: Exercise[]
	category: string
	imageUrl?: string
}

export type UpdateWorkoutDTO = Partial<WorkoutModel>

export interface IWorkoutRepo {
	// Read operations
	getAllWorkouts(): Promise<WorkoutModel[]>
	getWorkoutById(id: string): Promise<WorkoutModel | null>

	// Write operations
	createWorkout(data: CreateWorkoutDTO): Promise<WorkoutModel>
	updateWorkout(id: string, data: UpdateWorkoutDTO): Promise<WorkoutModel>
	deleteWorkout(id: string): Promise<void>

	// Optional: Queries
	searchWorkouts(query: string): Promise<WorkoutModel[]>
	getWorkoutsByCategory(category: string): Promise<WorkoutModel[]>
}
```

**Key Points:**
- Use `I{Feature}Repo` naming convention
- Define DTOs for create/update operations
- Return Promises for async operations
- Use domain models (`WorkoutModel`), not DTOs
- Include only data access methods (no business logic)

### Step 2: Create Domain Model

**Location**: `src/domain/{Feature}/{Feature}Model.ts`

**Example**: `src/domain/Workout/WorkoutModel.ts`

```typescript
export type Exercise = {
	id: string
	name: string
	sets: number
	reps: number
	rest: number
}

export type WorkoutModel = {
	id: string
	title: string
	exercises: Exercise[]
	category: string
	imageUrl?: string
	createdAt: Date
	updatedAt: Date
}
```

**Key Points:**
- Use domain language (not API/database terminology)
- Pure TypeScript types (no dependencies)
- Use camelCase (not snake_case)
- Include all relevant domain fields

### Step 3: Create Adapter (if needed)

**Location**: `src/infra/repos/{Feature}/{Feature}Adapter.ts`

**When to create:**
- ✅ External data format ≠ domain model
- ✅ API uses snake_case, app uses camelCase
- ✅ Type transformations needed (string → Date, etc)
- ❌ Skip if data already matches domain model

**Example**: `src/infra/repos/Workout/WorkoutAdapter.ts`

```typescript
import { WorkoutModel } from '@/domain/Workout/WorkoutModel'

// External format (API, Database)
export type WorkoutDTO = {
	workout_id: string
	workout_title: string
	exercise_list: any[]
	category_name: string
	image_url?: string
	created_at: string
	updated_at: string
	user_id: string
}

export const workoutAdapter = {
	/**
	 * Transforms external DTO to domain model
	 * API → Domain
	 */
	toDomain: (dto: WorkoutDTO): WorkoutModel => {
		return {
			id: dto.workout_id,
			title: dto.workout_title,
			exercises: dto.exercise_list,
			category: dto.category_name,
			imageUrl: dto.image_url,
			createdAt: new Date(dto.created_at),
			updatedAt: new Date(dto.updated_at),
		}
	},

	/**
	 * Transforms domain model to external DTO
	 * Domain → API
	 */
	toDTO: (model: WorkoutModel): WorkoutDTO => {
		return {
			workout_id: model.id,
			workout_title: model.title,
			exercise_list: model.exercises,
			category_name: model.category,
			image_url: model.imageUrl,
			created_at: model.createdAt.toISOString(),
			updated_at: model.updatedAt.toISOString(),
			user_id: 'current-user', // from auth context
		}
	},

	/**
	 * Transforms array of DTOs to domain models
	 */
	toDomainList: (dtos: WorkoutDTO[]): WorkoutModel[] => {
		return dtos.map(dto => workoutAdapter.toDomain(dto))
	},
}
```

**Key Points:**
- Export DTO types for documentation
- Pure functions (no side effects, no logging)
- `toDomain`: External → Domain
- `toDTO`: Domain → External
- Helper methods for arrays (`toDomainList`)
- Handle type conversions (string → Date, etc)

### Step 4: Implement Repository

**Location**: `src/infra/repos/{Feature}/{Feature}Repo.ts`

**Example**: `src/infra/repos/Workout/WorkoutRepo.ts`

#### Option A: With External API

```typescript
import { IWorkoutRepo, CreateWorkoutDTO, UpdateWorkoutDTO } from '@/domain/Workout/IWorkoutRepo'
import { WorkoutModel } from '@/domain/Workout/WorkoutModel'
import { workoutAdapter, WorkoutDTO } from './WorkoutAdapter'

const API_URL = 'https://api.example.com'

export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async (): Promise<WorkoutModel[]> => {
		try {
			const response = await fetch(`${API_URL}/workouts`)

			if (!response.ok) {
				throw new Error('Failed to fetch workouts')
			}

			const dtos: WorkoutDTO[] = await response.json()
			return workoutAdapter.toDomainList(dtos)
		} catch (error) {
			console.error('API Error:', error)
			throw new Error('Não foi possível carregar os treinos')
		}
	},

	getWorkoutById: async (id: string): Promise<WorkoutModel | null> => {
		try {
			const response = await fetch(`${API_URL}/workouts/${id}`)

			if (response.status === 404) {
				return null
			}

			if (!response.ok) {
				throw new Error('Failed to fetch workout')
			}

			const dto: WorkoutDTO = await response.json()
			return workoutAdapter.toDomain(dto)
		} catch (error) {
			console.error('API Error:', error)
			throw new Error('Não foi possível carregar o treino')
		}
	},

	createWorkout: async (data: CreateWorkoutDTO): Promise<WorkoutModel> => {
		try {
			const newWorkout: WorkoutModel = {
				...data,
				id: crypto.randomUUID(),
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const dto = workoutAdapter.toDTO(newWorkout)

			const response = await fetch(`${API_URL}/workouts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dto),
			})

			if (!response.ok) {
				throw new Error('Failed to create workout')
			}

			const responseDto: WorkoutDTO = await response.json()
			return workoutAdapter.toDomain(responseDto)
		} catch (error) {
			console.error('API Error:', error)
			throw new Error('Não foi possível criar o treino')
		}
	},

	updateWorkout: async (id: string, data: UpdateWorkoutDTO): Promise<WorkoutModel> => {
		try {
			const response = await fetch(`${API_URL}/workouts/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error('Failed to update workout')
			}

			const dto: WorkoutDTO = await response.json()
			return workoutAdapter.toDomain(dto)
		} catch (error) {
			console.error('API Error:', error)
			throw new Error('Não foi possível atualizar o treino')
		}
	},

	deleteWorkout: async (id: string): Promise<void> => {
		try {
			const response = await fetch(`${API_URL}/workouts/${id}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error('Failed to delete workout')
			}
		} catch (error) {
			console.error('API Error:', error)
			throw new Error('Não foi possível excluir o treino')
		}
	},

	searchWorkouts: async (query: string): Promise<WorkoutModel[]> => {
		try {
			const response = await fetch(`${API_URL}/workouts/search?q=${encodeURIComponent(query)}`)

			if (!response.ok) {
				throw new Error('Failed to search workouts')
			}

			const dtos: WorkoutDTO[] = await response.json()
			return workoutAdapter.toDomainList(dtos)
		} catch (error) {
			console.error('API Error:', error)
			throw new Error('Não foi possível buscar treinos')
		}
	},

	getWorkoutsByCategory: async (category: string): Promise<WorkoutModel[]> => {
		try {
			const response = await fetch(`${API_URL}/workouts?category=${encodeURIComponent(category)}`)

			if (!response.ok) {
				throw new Error('Failed to fetch workouts by category')
			}

			const dtos: WorkoutDTO[] = await response.json()
			return workoutAdapter.toDomainList(dtos)
		} catch (error) {
			console.error('API Error:', error)
			throw new Error('Não foi possível carregar treinos da categoria')
		}
	},
}
```

#### Option B: With Local Storage (React Native)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IWorkoutRepo, CreateWorkoutDTO, UpdateWorkoutDTO } from '@/domain/Workout/IWorkoutRepo'
import { WorkoutModel } from '@/domain/Workout/WorkoutModel'

const STORAGE_KEY = '@workouts'

export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async (): Promise<WorkoutModel[]> => {
		try {
			const data = await AsyncStorage.getItem(STORAGE_KEY)
			return data ? JSON.parse(data) : []
		} catch (error) {
			console.error('Storage Error:', error)
			throw new Error('Não foi possível carregar os treinos')
		}
	},

	getWorkoutById: async (id: string): Promise<WorkoutModel | null> => {
		try {
			const workouts = await workoutRepo.getAllWorkouts()
			return workouts.find(w => w.id === id) || null
		} catch (error) {
			console.error('Storage Error:', error)
			throw new Error('Não foi possível carregar o treino')
		}
	},

	createWorkout: async (data: CreateWorkoutDTO): Promise<WorkoutModel> => {
		try {
			const workouts = await workoutRepo.getAllWorkouts()

			const newWorkout: WorkoutModel = {
				...data,
				id: crypto.randomUUID(),
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			workouts.push(newWorkout)
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))

			return newWorkout
		} catch (error) {
			console.error('Storage Error:', error)
			throw new Error('Não foi possível criar o treino')
		}
	},

	updateWorkout: async (id: string, data: UpdateWorkoutDTO): Promise<WorkoutModel> => {
		try {
			const workouts = await workoutRepo.getAllWorkouts()
			const index = workouts.findIndex(w => w.id === id)

			if (index === -1) {
				throw new Error('Workout not found')
			}

			const updatedWorkout: WorkoutModel = {
				...workouts[index],
				...data,
				updatedAt: new Date(),
			}

			workouts[index] = updatedWorkout
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))

			return updatedWorkout
		} catch (error) {
			console.error('Storage Error:', error)
			throw new Error('Não foi possível atualizar o treino')
		}
	},

	deleteWorkout: async (id: string): Promise<void> => {
		try {
			const workouts = await workoutRepo.getAllWorkouts()
			const filtered = workouts.filter(w => w.id !== id)
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
		} catch (error) {
			console.error('Storage Error:', error)
			throw new Error('Não foi possível excluir o treino')
		}
	},

	searchWorkouts: async (query: string): Promise<WorkoutModel[]> => {
		try {
			const workouts = await workoutRepo.getAllWorkouts()
			const lowerQuery = query.toLowerCase()

			return workouts.filter(w =>
				w.title.toLowerCase().includes(lowerQuery) ||
				w.category.toLowerCase().includes(lowerQuery)
			)
		} catch (error) {
			console.error('Storage Error:', error)
			throw new Error('Não foi possível buscar treinos')
		}
	},

	getWorkoutsByCategory: async (category: string): Promise<WorkoutModel[]> => {
		try {
			const workouts = await workoutRepo.getAllWorkouts()
			return workouts.filter(w => w.category === category)
		} catch (error) {
			console.error('Storage Error:', error)
			throw new Error('Não foi possível carregar treinos da categoria')
		}
	},
}
```

**Key Points:**
- Implement all interface methods
- Type-safe: `export const workoutRepo: IWorkoutRepo = { ... }`
- Handle errors gracefully (try-catch)
- Use adapters for external data transformation
- Encapsulate storage keys/URLs (not exported)
- Return user-friendly error messages

### Step 5: Create Repository Provider Context

**Location**: `src/infra/providers/RepositoryProvider.tsx`

**Initial Setup** (if provider doesn't exist yet):

```typescript
import React, { createContext, useContext, ReactNode } from 'react'
import { IWorkoutRepo } from '@/domain/Workout/IWorkoutRepo'
import { workoutRepo } from '@/infra/repos/Workout/WorkoutRepo'

type RepositoryContextValue = {
	workoutRepo: IWorkoutRepo
	// Add more repositories here as you create them
	// exerciseRepo: IExerciseRepo
	// userRepo: IUserRepo
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null)

export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
	return (
		<RepositoryContext.Provider
			value={{
				workoutRepo,
				// Add more repositories here
			}}
		>
			{children}
		</RepositoryContext.Provider>
	)
}

export const useRepositories = () => {
	const context = useContext(RepositoryContext)

	if (!context) {
		throw new Error('useRepositories must be used within RepositoryProvider')
	}

	return context
}
```

**Adding New Repository** (if provider already exists):

```typescript
// 1. Import the interface and implementation
import { IExerciseRepo } from '@/domain/Exercise/IExerciseRepo'
import { exerciseRepo } from '@/infra/repos/Exercise/ExerciseRepo'

// 2. Add to type
type RepositoryContextValue = {
	workoutRepo: IWorkoutRepo
	exerciseRepo: IExerciseRepo // ← Add here
}

// 3. Add to provider value
<RepositoryContext.Provider
	value={{
		workoutRepo,
		exerciseRepo, // ← Add here
	}}
>
```

### Step 6: Connect Provider to App Root

**Location**: `src/app/_layout.tsx`

```typescript
import { RepositoryProvider } from '@/infra/providers/RepositoryProvider'

export default function RootLayout() {
	return (
		<RepositoryProvider>
			<ThemeProvider>
				<AuthProvider>
					<Stack>
						{/* Your routes */}
					</Stack>
				</AuthProvider>
			</ThemeProvider>
		</RepositoryProvider>
	)
}
```

**Key Points:**
- Wrap at root level (before other providers if possible)
- Makes repositories available globally
- Enables dependency injection

### Step 7: Use Repository in UI Layer

**Location**: `src/ui/screens/{Feature}/use{Feature}.ts`

**Example**: `src/ui/screens/Home/useHome.ts`

```typescript
import { useState, useEffect } from 'react'
import { useRepositories } from '@/infra/providers/RepositoryProvider'
import { WorkoutModel } from '@/domain/Workout/WorkoutModel'

export const useHome = () => {
	const { workoutRepo } = useRepositories()
	const [workouts, setWorkouts] = useState<WorkoutModel[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadWorkouts = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await workoutRepo.getAllWorkouts()
			setWorkouts(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro desconhecido')
		} finally {
			setLoading(false)
		}
	}

	const deleteWorkout = async (id: string) => {
		try {
			await workoutRepo.deleteWorkout(id)
			await loadWorkouts() // Reload list
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao excluir')
		}
	}

	useEffect(() => {
		loadWorkouts()
	}, [])

	return {
		workouts,
		loading,
		error,
		refreshWorkouts: loadWorkouts,
		deleteWorkout,
	}
}
```

**Key Points:**
- Never import repository implementation directly
- Always use `useRepositories()` hook
- Handle loading and error states
- Return data and actions for the screen

## Advanced Patterns

### Service Layer (Coordinating Multiple Repositories)

**When to use:**
- Operations involving multiple repositories
- Complex technical operations (not business logic)
- Cross-cutting concerns (caching, batching)

**Location**: `src/infra/services/{Feature}Service.ts`

**Example**: `src/infra/services/WorkoutService.ts`

```typescript
import { IWorkoutRepo } from '@/domain/Workout/IWorkoutRepo'
import { IExerciseRepo } from '@/domain/Exercise/IExerciseRepo'

export const createWorkoutService = (
	workoutRepo: IWorkoutRepo,
	exerciseRepo: IExerciseRepo
) => ({
	/**
	 * Duplicates a workout with all its exercises
	 * Coordinates multiple repositories
	 */
	duplicateWorkout: async (workoutId: string) => {
		// 1. Get original workout
		const workout = await workoutRepo.getWorkoutById(workoutId)
		if (!workout) {
			throw new Error('Workout não encontrado')
		}

		// 2. Get all exercises
		const exercises = await exerciseRepo.getByWorkout(workoutId)

		// 3. Create new workout
		const newWorkout = await workoutRepo.createWorkout({
			...workout,
			title: `${workout.title} (cópia)`,
		})

		// 4. Create new exercises
		await exerciseRepo.bulkCreate(exercises, newWorkout.id)

		return newWorkout
	},

	/**
	 * Deletes workout and all related exercises
	 */
	deleteWorkoutWithExercises: async (workoutId: string) => {
		await exerciseRepo.deleteByWorkout(workoutId)
		await workoutRepo.deleteWorkout(workoutId)
	},
})

// Hook for UI consumption
export const useWorkoutService = () => {
	const { workoutRepo, exerciseRepo } = useRepositories()
	return createWorkoutService(workoutRepo, exerciseRepo)
}
```

### Mock Repository for Testing

**Location**: `src/infra/repos/{Feature}/{Feature}Repo.mock.ts`

```typescript
import { IWorkoutRepo } from '@/domain/Workout/IWorkoutRepo'
import { WorkoutModel } from '@/domain/Workout/WorkoutModel'

const mockWorkouts: WorkoutModel[] = [
	{
		id: '1',
		title: 'Treino A - Peito e Tríceps',
		exercises: [],
		category: 'strength',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '2',
		title: 'Treino B - Costas e Bíceps',
		exercises: [],
		category: 'strength',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
]

export const workoutRepoMock: IWorkoutRepo = {
	getAllWorkouts: async () => {
		return [...mockWorkouts]
	},

	getWorkoutById: async (id: string) => {
		return mockWorkouts.find(w => w.id === id) || null
	},

	createWorkout: async (data) => {
		const newWorkout: WorkoutModel = {
			...data,
			id: String(mockWorkouts.length + 1),
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		mockWorkouts.push(newWorkout)
		return newWorkout
	},

	updateWorkout: async (id, data) => {
		const index = mockWorkouts.findIndex(w => w.id === id)
		if (index === -1) throw new Error('Not found')

		mockWorkouts[index] = {
			...mockWorkouts[index],
			...data,
			updatedAt: new Date(),
		}
		return mockWorkouts[index]
	},

	deleteWorkout: async (id) => {
		const index = mockWorkouts.findIndex(w => w.id === id)
		if (index !== -1) {
			mockWorkouts.splice(index, 1)
		}
	},

	searchWorkouts: async (query) => {
		return mockWorkouts.filter(w =>
			w.title.toLowerCase().includes(query.toLowerCase())
		)
	},

	getWorkoutsByCategory: async (category) => {
		return mockWorkouts.filter(w => w.category === category)
	},
}
```

### Platform-Specific Implementations

**React Native** (AsyncStorage):

```typescript
// src/infra/repos/Workout/WorkoutRepo.native.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IWorkoutRepo } from '@/domain/Workout/IWorkoutRepo'

export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		const data = await AsyncStorage.getItem('@workouts')
		return data ? JSON.parse(data) : []
	},
	// ... other methods
}
```

**React Web** (localStorage):

```typescript
// src/infra/repos/Workout/WorkoutRepo.web.ts
import { IWorkoutRepo } from '@/domain/Workout/IWorkoutRepo'

export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		const data = localStorage.getItem('@workouts')
		return data ? JSON.parse(data) : []
	},
	// ... other methods
}
```

**Provider selects the right implementation**:

```typescript
// src/infra/providers/RepositoryProvider.tsx
import { Platform } from 'react-native'

// Dynamic import based on platform
const workoutRepo = Platform.OS === 'web'
	? require('@/infra/repos/Workout/WorkoutRepo.web').workoutRepo
	: require('@/infra/repos/Workout/WorkoutRepo.native').workoutRepo
```

## Repository vs Service vs Use Case

### Repository
**Responsibility**: Data access and persistence

```typescript
// ✅ Repository methods
repo.getAllWorkouts()
repo.getWorkoutById(id)
repo.createWorkout(data)
repo.updateWorkout(id, data)
repo.deleteWorkout(id)
```

### Service
**Responsibility**: Coordinate multiple repositories or complex technical operations

```typescript
// ✅ Service methods
service.duplicateWorkout(id)           // Uses workoutRepo + exerciseRepo
service.syncWithCloud()                 // Coordinates local + remote repos
service.exportWorkoutsToCSV()          // Technical operation
```

### Use Case
**Responsibility**: Business logic specific to the application

```typescript
// ✅ Use Case (Domain layer)
// src/domain/Workout/useCases/CreateWorkoutUseCase.ts
export const useCreateWorkout = () => {
	const { workoutRepo } = useRepositories()

	return {
		execute: async (data: CreateWorkoutDTO) => {
			// Business validations
			if (!data.title.trim()) {
				throw new Error('Título obrigatório')
			}

			if (data.exercises.length === 0) {
				throw new Error('Treino deve ter ao menos 1 exercício')
			}

			// Delegates persistence to repository
			return workoutRepo.createWorkout(data)
		},
	}
}
```

## Best Practices

### ✅ DO

1. **Always implement domain interfaces**
   ```typescript
   // ✅ Type-safe implementation
   export const workoutRepo: IWorkoutRepo = { /* ... */ }
   ```

2. **Use dependency injection via Context**
   ```typescript
   // ✅ Testable, decoupled
   const { workoutRepo } = useRepositories()
   ```

3. **Keep adapters pure (no side effects)**
   ```typescript
   // ✅ Pure function
   toDomain(dto: WorkoutDTO): WorkoutModel {
     return { id: dto.workout_id, ... }
   }
   ```

4. **Handle errors gracefully**
   ```typescript
   // ✅ User-friendly errors
   try {
     await fetch(url)
   } catch (error) {
     console.error('API Error:', error)
     throw new Error('Não foi possível carregar os treinos')
   }
   ```

5. **Encapsulate implementation details**
   ```typescript
   // ✅ Private constants
   const STORAGE_KEY = '@workouts' // not exported
   ```

### ❌ DON'T

1. **Domain importing Infra**
   ```typescript
   // ❌ NEVER
   // src/domain/Workout/WorkoutServices.ts
   import { WorkoutRepo } from '@/infra/repos/Workout/WorkoutRepo'
   ```

2. **Business logic in Repository**
   ```typescript
   // ❌ BAD - business rule in repo
   async createWorkout(data: CreateWorkoutDTO) {
     if (data.exercises.length < 3) {
       throw new Error('Mínimo 3 exercícios') // ❌ Business rule
     }
     // ...
   }
   ```

3. **Direct access to external libs in UI**
   ```typescript
   // ❌ BAD - UI accessing AsyncStorage directly
   const HomeScreen = () => {
     useEffect(() => {
       AsyncStorage.getItem('@workouts').then(...)
     }, [])
   }
   ```

4. **Complex logic in Adapters**
   ```typescript
   // ❌ BAD - business validation in adapter
   toDomain(dto: WorkoutDTO): WorkoutModel {
     if (dto.exercise_list.length === 0) {
       throw new Error('Invalid workout') // ❌ Business logic
     }
     return { ... }
   }
   ```

5. **Mixed responsibilities**
   ```typescript
   // ❌ BAD - Repository doing multiple things
   async createWorkout(data: CreateWorkoutDTO) {
     // ❌ Validation (should be Use Case)
     if (!data.title) throw new Error('...')

     // ❌ Analytics (should be separate service)
     trackEvent('workout_created')

     // ❌ UI manipulation (should be in screen)
     showToast('Treino criado!')

     // ✅ OK - persistence
     return await save(data)
   }
   ```

## Testing Strategy

### Unit Tests - Domain Interface

```typescript
// src/domain/Workout/__tests__/IWorkoutRepo.test.ts
import { IWorkoutRepo } from '../IWorkoutRepo'
import { workoutRepoMock } from '@/infra/repos/Workout/WorkoutRepo.mock'

describe('IWorkoutRepo', () => {
	let repo: IWorkoutRepo

	beforeEach(() => {
		repo = workoutRepoMock
	})

	it('should get all workouts', async () => {
		const workouts = await repo.getAllWorkouts()
		expect(workouts).toHaveLength(2)
	})

	it('should create workout', async () => {
		const newWorkout = await repo.createWorkout({
			title: 'New Workout',
			exercises: [],
			category: 'cardio',
		})

		expect(newWorkout.id).toBeDefined()
		expect(newWorkout.title).toBe('New Workout')
	})
})
```

### Integration Tests - Repository Implementation

```typescript
// src/infra/repos/Workout/__tests__/WorkoutRepo.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { workoutRepo } from '../WorkoutRepo'

describe('WorkoutRepo', () => {
	beforeEach(async () => {
		await AsyncStorage.clear()
	})

	it('should persist workouts to AsyncStorage', async () => {
		await workoutRepo.createWorkout({
			title: 'Test Workout',
			exercises: [],
			category: 'strength',
		})

		const workouts = await workoutRepo.getAllWorkouts()
		expect(workouts).toHaveLength(1)
		expect(workouts[0].title).toBe('Test Workout')
	})
})
```

### Component Tests with Mock Provider

```typescript
// src/ui/screens/Home/__tests__/Home.test.tsx
import { render, screen } from '@testing-library/react-native'
import { RepositoryContext } from '@/infra/providers/RepositoryProvider'
import { workoutRepoMock } from '@/infra/repos/Workout/WorkoutRepo.mock'
import { HomeScreen } from '../Home'

const wrapper = ({ children }) => (
	<RepositoryContext.Provider value={{ workoutRepo: workoutRepoMock }}>
		{children}
	</RepositoryContext.Provider>
)

describe('HomeScreen', () => {
	it('should display workouts', async () => {
		render(<HomeScreen />, { wrapper })

		expect(await screen.findByText('Treino A - Peito e Tríceps')).toBeTruthy()
		expect(await screen.findByText('Treino B - Costas e Bíceps')).toBeTruthy()
	})
})
```

## Checklist

Use this checklist when creating a new infrastructure layer for a feature:

- [ ] **Step 1**: Create domain interface (`I{Feature}Repo.ts`)
  - [ ] Define all CRUD methods
  - [ ] Create DTOs for create/update
  - [ ] Use domain models in return types

- [ ] **Step 2**: Create domain model (`{Feature}Model.ts`)
  - [ ] Define all domain fields
  - [ ] Use camelCase naming
  - [ ] No external dependencies

- [ ] **Step 3**: Create adapter (if needed) (`{Feature}Adapter.ts`)
  - [ ] Define external DTO type
  - [ ] Implement `toDomain` method
  - [ ] Implement `toDTO` method
  - [ ] Add helper methods (`toDomainList`, etc)

- [ ] **Step 4**: Implement repository (`{Feature}Repo.ts`)
  - [ ] Implement all interface methods
  - [ ] Type-safe: `const repo: I{Feature}Repo = { ... }`
  - [ ] Handle errors with try-catch
  - [ ] Use adapters for transformations
  - [ ] Add user-friendly error messages

- [ ] **Step 5**: Update Repository Provider
  - [ ] Import interface and implementation
  - [ ] Add to `RepositoryContextValue` type
  - [ ] Add to provider value

- [ ] **Step 6**: Connect provider (if not connected)
  - [ ] Wrap app root with `<RepositoryProvider>`

- [ ] **Step 7**: Use in UI layer
  - [ ] Use `useRepositories()` hook
  - [ ] Never import implementation directly
  - [ ] Handle loading/error states

- [ ] **Optional**: Create mock repository
  - [ ] Implement same interface
  - [ ] Use for tests and development

- [ ] **Optional**: Create service (if needed)
  - [ ] Coordinate multiple repositories
  - [ ] Export hook for UI consumption

## Common Patterns

### Pagination

```typescript
export interface IWorkoutRepo {
	getAllWorkouts(page: number, pageSize: number): Promise<{
		data: WorkoutModel[]
		total: number
		hasMore: boolean
	}>
}
```

### Caching

```typescript
const cache = new Map<string, WorkoutModel>()

export const workoutRepo: IWorkoutRepo = {
	getWorkoutById: async (id: string) => {
		// Check cache first
		if (cache.has(id)) {
			return cache.get(id)!
		}

		// Fetch from API
		const workout = await fetchFromAPI(id)

		// Store in cache
		cache.set(id, workout)

		return workout
	},
}
```

### Optimistic Updates

```typescript
export const useCreateWorkout = () => {
	const { workoutRepo } = useRepositories()
	const [workouts, setWorkouts] = useState<WorkoutModel[]>([])

	const createWorkout = async (data: CreateWorkoutDTO) => {
		// Optimistic update
		const tempId = `temp-${Date.now()}`
		const optimisticWorkout: WorkoutModel = {
			...data,
			id: tempId,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		setWorkouts(prev => [...prev, optimisticWorkout])

		try {
			// Real API call
			const realWorkout = await workoutRepo.createWorkout(data)

			// Replace optimistic with real
			setWorkouts(prev =>
				prev.map(w => w.id === tempId ? realWorkout : w)
			)

			return realWorkout
		} catch (error) {
			// Rollback on error
			setWorkouts(prev => prev.filter(w => w.id !== tempId))
			throw error
		}
	}

	return { createWorkout }
}
```

### Retry Logic

```typescript
const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
	for (let i = 0; i < retries; i++) {
		try {
			const response = await fetch(url)
			if (response.ok) {
				return response
			}
		} catch (error) {
			if (i === retries - 1) throw error
			await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
		}
	}
	throw new Error('Max retries reached')
}
```

## Summary

The infrastructure layer is the bridge between external dependencies (APIs, databases, services, platforms) and the application's internal logic (domain). By following Clean Architecture principles and using patterns like Repository and Adapter, we achieve:

- 🎯 **Decoupling** from external libraries
- 🧪 **Easy testing** with interface mocks
- 🔄 **Substitutability** without impacting domain
- 📦 **Isolation** of changes in external dependencies
- 🚀 **Clean and scalable** code
- 🌐 **Platform independence** (React, React Native, Node.js)

**Golden Rule**: Domain defines **WHAT** to do, Infra defines **HOW** to do it (and adapts for each platform).

````
