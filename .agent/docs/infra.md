# Documentação da Camada de Infraestrutura (Infra)

## Índice

1. [Introdução](#introdução)
2. [Princípios de Clean Architecture](#princípios-de-clean-architecture)
3. [Padrões Arquiteturais](#padrões-arquiteturais)
4. [Estrutura da Camada Infra](#estrutura-da-camada-infra)
5. [Relação com a Camada de Domínio](#relação-com-a-camada-de-domínio)
6. [Benefícios da Abstração](#benefícios-da-abstração)
7. [Decisões Arquiteturais](#decisões-arquiteturais)
8. [Boas Práticas](#boas-práticas)

---

## Introdução

A camada de infraestrutura (`src/infra`) é responsável por implementar **dependências externas** como:

- 📦 **Banco de dados** (Async Storage, Realm, SQLite, MMKV)
- 🌐 **APIs externas** (HTTP clients, GraphQL)
- 📊 **Analytics** (Firebase Analytics, Amplitude)
- 💾 **Cache e Storage**
- 🔐 **Autenticação** (OAuth, token management)
- 📱 **Serviços nativos** (câmera, localização, notificações)

### Por que separar a camada de infraestrutura?

O principal objetivo é **desacoplar a aplicação de bibliotecas e serviços externos**, permitindo que:

- ✅ A lógica de negócio (domain) não dependa de implementações concretas
- ✅ Seja fácil trocar uma biblioteca por outra (ex: Axios → Fetch)
- ✅ O código seja mais testável (mocks e stubs simplificados)
- ✅ A manutenção seja facilitada (mudanças isoladas na infra)
- ✅ **O código seja independente de plataforma** (funciona em React, React Native, Node.js, etc)

### Independência de Plataforma

**É responsabilidade da camada Infra garantir que nosso código não dependa de bibliotecas específicas de plataforma para funcionar.**

O mesmo código de **domínio** e **UI** deve funcionar tanto no **React** quanto no **React Native**, e é a **infra** quem adapta as dependências externas para cada ambiente.

#### Exemplo: Storage

```typescript
// ❌ PROBLEMA: Código acoplado à plataforma
// No React Native
import AsyncStorage from "@react-native-async-storage/async-storage"

export const saveWorkout = async (workout: WorkoutModel) => {
	await AsyncStorage.setItem("@workout", JSON.stringify(workout))
}

// No React Web - ERRO! AsyncStorage não existe no navegador
// Precisaria reescrever tudo usando localStorage
```

```typescript
// ✅ SOLUÇÃO: Infra abstrai a plataforma
// Domain define a interface (independente de plataforma)
export interface IWorkoutRepo {
	saveWorkout(workout: WorkoutModel): Promise<void>
	getWorkout(id: string): Promise<WorkoutModel | null>
}

// Infra - Implementação para React Native
import AsyncStorage from "@react-native-async-storage/async-storage"

export const workoutRepoRN: IWorkoutRepo = {
	saveWorkout: async (workout) => {
		await AsyncStorage.setItem("@workout", JSON.stringify(workout))
	},
	getWorkout: async (id) => {
		const data = await AsyncStorage.getItem("@workout")
		return data ? JSON.parse(data) : null
	},
}

// Infra - Implementação para React Web
export const workoutRepoWeb: IWorkoutRepo = {
	saveWorkout: async (workout) => {
		localStorage.setItem("@workout", JSON.stringify(workout))
	},
	getWorkout: async (id) => {
		const data = localStorage.getItem("@workout")
		return data ? JSON.parse(data) : null
	},
}

// Domain/UI usa a interface - FUNCIONA EM QUALQUER PLATAFORMA! ✅
const { workoutRepo } = useRepositories()
await workoutRepo.saveWorkout(newWorkout)
```

#### Exemplo: Navegação

```typescript
// Domain define a interface
export interface INavigationService {
	navigate(screen: string, params?: any): void
	goBack(): void
}

// Infra - React Native (Expo Router)
import { router } from "expo-router"

export const navigationServiceRN: INavigationService = {
	navigate: (screen, params) => router.push({ pathname: screen, params }),
	goBack: () => router.back(),
}

// Infra - React Web (React Router)
import { useNavigate } from "react-router-dom"

export const navigationServiceWeb: INavigationService = {
	navigate: (screen, params) => navigate(screen, { state: params }),
	goBack: () => navigate(-1),
}
```

#### Exemplo: Requisições HTTP

```typescript
// Domain define a interface
export interface IHttpClient {
	get<T>(url: string): Promise<T>
	post<T>(url: string, data: any): Promise<T>
}

// Infra - React Native (pode usar fetch nativo)
export const httpClientRN: IHttpClient = {
	get: async (url) => {
		const response = await fetch(url)
		return response.json()
	},
	post: async (url, data) => {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
		})
		return response.json()
	},
}

// Infra - Node.js (usa axios ou node-fetch)
import axios from "axios"

export const httpClientNode: IHttpClient = {
	get: async (url) => {
		const { data } = await axios.get(url)
		return data
	},
	post: async (url, data) => {
		const { data: response } = await axios.post(url, data)
		return response
	},
}
```

### Vantagens da Independência de Plataforma

1. **Portabilidade**: Migrar de React Native para React (ou vice-versa) é muito mais fácil
2. **Reaproveitamento**: Mesma lógica de negócio funciona em múltiplos ambientes
3. **Testes**: Pode testar a lógica de negócio em Node.js (mais rápido que emuladores)
4. **Futuro**: Adicionar novas plataformas (Electron, extensão de navegador) sem reescrever tudo

**Em resumo**: A infra é a **camada de adaptação** entre o mundo externo (plataformas, libs, APIs) e o núcleo da aplicação (domain + UI core).

---

## Princípios de Clean Architecture

A arquitetura do projeto segue os princípios da **Clean Architecture** (Robert C. Martin), onde as dependências fluem sempre **de fora para dentro**:

```
┌─────────────────────────────────────────┐
│          UI Layer (src/ui)              │  ← Dependências externas
│  (Screens, Components, Hooks)           │     (React Native, Expo)
└──────────────┬──────────────────────────┘
               │ depende de ↓
┌──────────────▼──────────────────────────┐
│       Domain Layer (src/domain)         │  ← Regras de negócio puras
│  (Entities, Interfaces, Use Cases)      │     (sem dependências externas)
└──────────────△──────────────────────────┘
               │ implementado por ↓
┌──────────────┴──────────────────────────┐
│       Infra Layer (src/infra)           │  ← Implementações concretas
│  (Repositories, Adapters, APIs)         │     (libs externas permitidas)
└─────────────────────────────────────────┘
```

### Regras fundamentais

1. **Domain não conhece Infra**: A camada de domínio define **interfaces** (`IWorkoutRepo`), mas nunca importa implementações concretas da infra
2. **Infra implementa Domain**: A camada infra importa interfaces do domain e as implementa
3. **UI depende de Domain**: As telas e componentes usam interfaces do domain, não implementações diretas da infra
4. **Inversão de Dependência**: Dependências apontam para abstrações, não para concretizações

---

## Padrões Arquiteturais

### 1. Repository Pattern

O **padrão Repository** abstrai o acesso a dados, independentemente da fonte (API, banco local, cache).

#### Interface (Domain Layer)

Arquivo: [`src/domain/Workout/IWorkoutRepo.ts`](../src/domain/Workout/IWorkoutRepo.ts)

```typescript
export interface IWorkoutRepo {
	getAllWorkouts(): Promise<WorkoutModel[]>
	getWorkoutById(id: string): Promise<WorkoutModel | null>
	createWorkout(workout: CreateWorkoutDTO): Promise<WorkoutModel>
	updateWorkout(workout: WorkoutModel): Promise<WorkoutModel>
	deleteWorkout(id: string): Promise<void>
}
```

#### Implementação (Infra Layer)

Arquivo: [`src/infra/repos/Workout/WorkoutRepo.ts`](../src/infra/repos/Workout/WorkoutRepo.ts)

```typescript
// Exemplo de implementação com AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage"
import { IWorkoutRepo } from "@/domain/Workout/IWorkoutRepo"
import { WorkoutModel } from "@/domain/Workout/WorkoutModel"

const STORAGE_KEY = "@workouts"

export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		const data = await AsyncStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : []
	},

	getWorkoutById: async (id: string) => {
		const workouts = await workoutRepo.getAllWorkouts()
		return workouts.find((w) => w.id === id) || null
	},

	// ... outros métodos
}
```

#### Benefícios do Repository Pattern

- 🎯 **Single Source of Truth**: Um único ponto de acesso aos dados
- 🔄 **Substituibilidade**: Trocar AsyncStorage por Realm sem impactar o domain
- 🧪 **Testabilidade**: Criar mocks da interface para testes unitários
- 📦 **Encapsulamento**: Detalhes de persistência ocultos do restante da app

---

### 2. Adapter Pattern

O **padrão Adapter** transforma dados de **formatos externos** (API, banco) para **modelos de domínio** e vice-versa.

#### Por que usar Adapters?

APIs e bancos de dados geralmente retornam dados em formatos diferentes dos modelos de domínio:

```typescript
// ❌ Formato da API (snake_case, campos extras)
{
  "workout_id": "123",
  "workout_title": "Treino A",
  "created_at": "2025-01-01T10:00:00Z",
  "user_id": "user-456",
  "is_active": true
}

// ✅ Modelo de Domínio (camelCase, apenas dados relevantes)
{
  "id": "123",
  "title": "Treino A",
  "exercises": [...],
  "category": "strength"
}
```

#### Implementação do Adapter

Arquivo: [`src/infra/repos/Workout/WorkoutAdapter.ts`](../src/infra/repos/Workout/WorkoutAdapter.ts)

```typescript
import { WorkoutModel } from "@/domain/Workout/WorkoutModel"

// Tipo que vem da API
type WorkoutDTO = {
	workout_id: string
	workout_title: string
	exercise_list: any[]
	category_name: string
	image_url?: string
	created_at: string
	user_id: string
}

export const workoutAdapter = {
	// API → Domain
	toDomain: (dto: WorkoutDTO): WorkoutModel => {
		return {
			id: dto.workout_id,
			title: dto.workout_title,
			exercises: dto.exercise_list,
			category: dto.category_name,
			imageUrl: dto.image_url,
		}
	},

	// Domain → API
	toDTO: (model: WorkoutModel): WorkoutDTO => {
		return {
			workout_id: model.id,
			workout_title: model.title,
			exercise_list: model.exercises,
			category_name: model.category,
			image_url: model.imageUrl,
			created_at: new Date().toISOString(),
			user_id: "current-user", // obtido do contexto de auth
		}
	},

	// Útil para listas
	toDomainList: (dtos: WorkoutDTO[]): WorkoutModel[] => {
		return dtos.map((dto) => workoutAdapter.toDomain(dto))
	},
}
```

#### Uso do Adapter no Repository

```typescript
export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		// 1. Busca dados da fonte externa (API)
		const response = await fetch("https://api.example.com/workouts")
		const dtos: WorkoutDTO[] = await response.json()

		// 2. Adapter transforma para o modelo de domínio
		return workoutAdapter.toDomainList(dtos)
	},

	createWorkout: async (workout: CreateWorkoutDTO) => {
		// 1. Adapter transforma domain para formato da API
		const dto = workoutAdapter.toDTO(workout)

		// 2. Envia para a API
		const response = await fetch("https://api.example.com/workouts", {
			method: "POST",
			body: JSON.stringify(dto),
		})

		// 3. Transforma resposta de volta para domain
		const responseDto = await response.json()
		return workoutAdapter.toDomain(responseDto)
	},

	// ... outros métodos
}
```

---

## Estrutura da Camada Infra

```
src/infra/
├── repos/                    # Repositórios (implementam interfaces do domain)
│   └── Workout/
│       ├── WorkoutRepo.ts    # Implementação de IWorkoutRepo
│       └── WorkoutAdapter.ts # Transforma entre API ↔ Domain
│
├── api/                      # (Futuro) Cliente HTTP, interceptors
│   ├── httpClient.ts         # Wrapper do Axios/Fetch
│   ├── interceptors.ts       # Auth tokens, error handling
│   └── endpoints.ts          # URLs e configurações
│
├── storage/                  # (Futuro) Persistência local
│   ├── asyncStorage.ts       # Wrapper do AsyncStorage
│   └── cache.ts              # Cache management
│
├── analytics/                # (Futuro) Tracking de eventos
│   └── analyticsService.ts   # Firebase Analytics, Amplitude
│
└── services/                 # (Futuro) Serviços auxiliares
    ├── imageService.ts       # Upload de imagens
    └── notificationService.ts # Push notifications
```

### Organização por Feature

Cada feature (Workout, Exercise, User) tem sua própria pasta em `repos/`:

```
repos/
├── Workout/
│   ├── WorkoutRepo.ts
│   └── WorkoutAdapter.ts
├── Exercise/
│   ├── ExerciseRepo.ts
│   └── ExerciseAdapter.ts
└── User/
    ├── UserRepo.ts
    └── UserAdapter.ts
```

### Injeção de Dependência via React Context

Todos os repositórios são disponibilizados globalmente através de um **React Context Provider**.

#### Provider de Repositórios

Arquivo: `src/infra/providers/RepositoryProvider.tsx`

```typescript
import React, { createContext, useContext, ReactNode } from 'react'
import { IWorkoutRepo } from '@/domain/Workout/IWorkoutRepo'
import { workoutRepo } from '@/infra/repos/Workout/WorkoutRepo'

type RepositoryContextValue = {
	workoutRepo: IWorkoutRepo
	// exerciseRepo: IExerciseRepo
	// userRepo: IUserRepo
	// ... outros repos
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null)

export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
	return (
		<RepositoryContext.Provider
			value={{
				workoutRepo,
				// Adicione outros repos aqui
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

#### Uso no App Root

Arquivo: `src/app/_layout.tsx`

```typescript
import { RepositoryProvider } from '@/infra/providers/RepositoryProvider'

export default function RootLayout() {
	return (
		<RepositoryProvider>
			<ThemeProvider>
				<AuthProvider>
					{/* resto da app */}
				</AuthProvider>
			</ThemeProvider>
		</RepositoryProvider>
	)
}
```

---

## Relação com a Camada de Domínio

### Domain define o "O QUÊ", Infra define o "COMO"

| Domain Layer                        | Infra Layer                           |
| ----------------------------------- | ------------------------------------- |
| **Interface** `IWorkoutRepo`        | **Implementação** `WorkoutRepo`       |
| **Modelo** `WorkoutModel`           | **DTO** `WorkoutDTO`                  |
| **Use Case** `CreateWorkoutUseCase` | **Repository** que o use case consome |
| Define **regras de negócio**        | Define **detalhes técnicos**          |

### Fluxo de Dados

```
┌─────────────┐
│   Screen    │  useHome.ts
│   (UI)      │
└──────┬──────┘
       │ chama
       ▼
┌─────────────┐
│  Use Case   │  CreateWorkoutUseCase
│  (Domain)   │
└──────┬──────┘
       │ usa interface
       ▼
┌─────────────┐
│ IWorkoutRepo│  ← Interface (contrato)
│ (Domain)    │
└──────△──────┘
       │ implementada por
       │
┌──────┴──────┐
│ WorkoutRepo │  ← Implementação concreta
│  (Infra)    │
└──────┬──────┘
       │ acessa
       ▼
┌─────────────┐
│   API ou    │  AsyncStorage, Fetch, etc
│ Banco Local │
└─────────────┘
```

### Exemplo de Integração

#### 1. Domain define a interface

[`src/domain/Workout/IWorkoutRepo.ts`](../src/domain/Workout/IWorkoutRepo.ts):

```typescript
export interface IWorkoutRepo {
	getAllWorkouts(): Promise<WorkoutModel[]>
}
```

#### 2. Infra implementa a interface

[`src/infra/repos/Workout/WorkoutRepo.ts`](../src/infra/repos/Workout/WorkoutRepo.ts):

```typescript
import { IWorkoutRepo } from "@/domain/Workout/IWorkoutRepo"

export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		// Implementação concreta
	},
	// ... outros métodos
}
```

#### 3. UI consome através de React Context

```typescript
import { useRepositories } from '@/infra/providers/RepositoryProvider'

// Hook da tela
export const useHome = () => {
	const { workoutRepo } = useRepositories()
	const [workouts, setWorkouts] = useState<WorkoutModel[]>([])

	useEffect(() => {
		workoutRepo.getAllWorkouts().then(setWorkouts)
	}, [])

	return { workouts }
}

// Na tela, usa diretamente o hook
export const HomeScreen = () => {
	const { workouts } = useHome()

	return (
		<Screen>
			{workouts.map(workout => (
				<WorkoutCard key={workout.id} workout={workout} />
			))}
		</Screen>
	)
}
```

---

## Benefícios da Abstração

### 1. Testabilidade

**Sem abstração** (acoplamento direto):

```typescript
// ❌ Difícil de testar - depende do AsyncStorage
export const useHome = () => {
	const [workouts, setWorkouts] = useState([])

	useEffect(() => {
		AsyncStorage.getItem("@workouts").then((data) => {
			setWorkouts(JSON.parse(data))
		})
	}, [])
}
```

**Com abstração** (interface + Context):

```typescript
// ✅ Fácil de testar - usa mock do context
import { useRepositories } from '@/infra/providers/RepositoryProvider'

export const useHome = () => {
	const { workoutRepo } = useRepositories()
	const [workouts, setWorkouts] = useState([])

	useEffect(() => {
		workoutRepo.getAllWorkouts().then(setWorkouts)
	}, [])

	return { workouts }
}

// No teste - wrapper com mock
const mockRepo: IWorkoutRepo = {
	getAllWorkouts: jest.fn().mockResolvedValue([mockWorkout]),
	// ... outros métodos
}

const wrapper = ({ children }) => (
	<RepositoryContext.Provider value={{ workoutRepo: mockRepo }}>
		{children}
	</RepositoryContext.Provider>
)

render(<HomeScreen />, { wrapper })
```

### 2. Substituibilidade

Trocar a implementação sem impactar o domain ou UI:

```typescript
// Antes: AsyncStorage
export const workoutRepoAsyncStorage: IWorkoutRepo = {
	getAllWorkouts: async () => {
		const data = await AsyncStorage.getItem("@workouts")
		return data ? JSON.parse(data) : []
	},
	// ... outros métodos
}

// Depois: Realm (nenhuma mudança no domain ou UI!)
export const workoutRepoRealm: IWorkoutRepo = {
	getAllWorkouts: async () => {
		const realm = await Realm.open(config)
		return realm.objects("Workout").toJSON()
	},
	// ... outros métodos
}
```

### 3. Múltiplas Implementações

É possível ter diferentes implementações para diferentes contextos:

```typescript
// Produção: usa API real
const workoutRepoAPI: IWorkoutRepo = {
	/* ... */
}

// Desenvolvimento: usa mock data
const workoutRepoMock: IWorkoutRepo = {
	/* ... */
}

// Offline: usa cache local
const workoutRepoCache: IWorkoutRepo = {
	/* ... */
}

// Escolhe dinamicamente
const repo = __DEV__ ? workoutRepoMock : workoutRepoAPI
```

### 4. Manutenibilidade

Mudanças nas fontes de dados ficam isoladas na camada infra:

- Atualizar versão da API → só muda `WorkoutAdapter`
- Adicionar cache → só cria `CachedWorkoutRepo`
- Mudar biblioteca HTTP → só altera `httpClient.ts`
- Migrar banco de dados → só modifica `WorkoutRepo`

---

## Decisões Arquiteturais

### Repository vs Service vs Use Case

#### Repository

**Responsabilidade**: Acesso e persistência de dados

```typescript
// ✅ Faz sentido no Repository
repo.getAllWorkouts()
repo.createWorkout(workout)
repo.deleteWorkout(id)
```

#### Service

**Responsabilidade**: Operações complexas que coordenam múltiplos repositories ou lógica técnica (não de negócio)

```typescript
// ✅ Faz sentido no Service
import { useRepositories } from "@/infra/providers/RepositoryProvider"

export const useWorkoutService = () => {
	const { workoutRepo, exerciseRepo } = useRepositories()

	return {
		// Coordena múltiplos repos
		duplicateWorkout: async (id: string) => {
			const workout = await workoutRepo.getWorkoutById(id)
			if (!workout) throw new Error("Workout não encontrado")

			const exercises = await exerciseRepo.getByWorkout(id)
			const newWorkout = await workoutRepo.createWorkout({
				...workout,
				title: `${workout.title} (cópia)`,
			})
			await exerciseRepo.bulkCreate(exercises, newWorkout.id)
			return newWorkout
		},
	}
}

// Uso na tela/hook
const { duplicateWorkout } = useWorkoutService()
await duplicateWorkout("workout-123")
```

#### Use Case

**Responsabilidade**: Regras de negócio específicas da aplicação

```typescript
// ✅ Faz sentido no Use Case
import { useRepositories } from '@/infra/providers/RepositoryProvider'

export const useCreateWorkout = () => {
	const { workoutRepo } = useRepositories()

	return {
		execute: async (data: CreateWorkoutDTO) => {
			// Validações de negócio
			if (!data.title.trim()) {
				throw new Error("Título obrigatório")
			}

			if (data.exercises.length === 0) {
				throw new Error("Treino deve ter ao menos 1 exercício")
			}

			// Delega persistência para o repository
			return workoutRepo.createWorkout(data)
		},
	}
}

// Uso na tela/hook
const { execute: createWorkout } = useCreateWorkout()
await createWorkout({ title: 'Treino A', exercises: [...] })
```

### Quando criar um Adapter?

✅ **Crie um Adapter quando:**

- Formato externo ≠ modelo interno
- API usa snake_case, app usa camelCase
- Precisa transformar tipos (string → Date, etc)
- Dados externos têm campos extras/desnecessários

❌ **Não precisa de Adapter quando:**

- Formato externo = modelo interno
- Dados já vêm no formato correto
- Transformação é trivial (seria apenas um "pass-through")

### Estrutura de Pastas: Por Feature ou Por Tipo?

**✅ Escolhido: Por Feature** (`repos/Workout/`, `repos/Exercise/`)

Benefícios:

- Coesão: tudo relacionado a Workout fica junto
- Facilita encontrar código relacionado
- Escala melhor (features podem virar módulos separados)

**❌ Alternativa: Por Tipo** (`repos/`, `adapters/`, `services/`)

Desvantagem:

- Arquivos relacionados ficam em pastas diferentes
- Dificulta refatoração de features completas

---

## Boas Práticas

### ✅ DO: Boas práticas

#### 1. Sempre implemente interfaces do domain

```typescript
// ✅ BOM
export const workoutRepo: IWorkoutRepo = {
	// TypeScript garante que todos os métodos foram implementados
	getAllWorkouts: async () => {
		/* ... */
	},
	getWorkoutById: async (id) => {
		/* ... */
	},
	createWorkout: async (workout) => {
		/* ... */
	},
	updateWorkout: async (workout) => {
		/* ... */
	},
	deleteWorkout: async (id) => {
		/* ... */
	},
}

// ❌ RUIM
export const workoutRepo = {
	// Sem tipagem, pode esquecer métodos ou ter assinaturas erradas
	getAllWorkouts: async () => {
		/* ... */
	},
}
```

#### 2. Use injeção de dependência via Context

```typescript
// ✅ BOM - testável, desacoplado via Context
import { useRepositories } from "@/infra/providers/RepositoryProvider"

export const useHome = () => {
	const { workoutRepo } = useRepositories() // Injetado via Context
	// ...
}

// ❌ RUIM - acoplado, importação direta
import { workoutRepo } from "@/infra/repos/Workout/WorkoutRepo"

export const useHome = () => {
	// workoutRepo hard-coded, difícil de mockar em testes
	workoutRepo.getAllWorkouts()
}
```

#### 3. Adapters devem ser puros (sem side effects)

```typescript
// ✅ BOM - função pura
static toDomain(dto: WorkoutDTO): WorkoutModel {
  return {
    id: dto.workout_id,
    title: dto.workout_title,
  };
}

// ❌ RUIM - side effect
static toDomain(dto: WorkoutDTO): WorkoutModel {
  console.log('Converting...'); // side effect
  trackEvent('workout_converted'); // side effect
  return { ... };
}
```

#### 4. Encapsule detalhes de implementação

```typescript
// ✅ BOM - detalhes privados (closure)
const STORAGE_KEY = "@workouts" // não exportado
const cache = new Map<string, WorkoutModel>() // não exportado

export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		// usa STORAGE_KEY e cache internamente
		/* ... */
	},
}

// ❌ RUIM - vazamento de implementação
export const STORAGE_KEY = "@workouts" // exposto publicamente ❌
export const workoutRepo: IWorkoutRepo = {
	/* ... */
}
```

#### 5. Trate erros na camada infra

```typescript
// ✅ BOM - erros tratados e traduzidos
export const workoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		try {
			const response = await fetch("/api/workouts")
			if (!response.ok) {
				throw new Error("Erro ao buscar treinos")
			}
			const data = await response.json()
			return workoutAdapter.toDomainList(data)
		} catch (error) {
			// Log do erro técnico
			console.error("API Error:", error)
			// Lança erro do domínio
			throw new WorkoutNotFoundError("Não foi possível carregar os treinos")
		}
	},
}
```

### ❌ DON'T: Anti-patterns

#### 1. Domain importa Infra

```typescript
// ❌ NUNCA FAÇA ISSO
// src/domain/Workout/WorkoutServices.ts
import { WorkoutRepo } from "@/infra/repos/Workout/WorkoutRepo" // ❌ ERRADO!

// ✅ CORRETO: Domain só conhece a interface
import { IWorkoutRepo } from "./IWorkoutRepo" // ✅ OK
```

#### 2. Lógica de negócio no Repository

```typescript
// ❌ RUIM - regra de negócio no repo
async createWorkout(workout: CreateWorkoutDTO) {
  if (workout.exercises.length < 3) {
    throw new Error('Mínimo 3 exercícios'); // ❌ regra de negócio
  }
  // ...persistência
}

// ✅ BOM - regra de negócio no Use Case, repo só persiste
// Use Case
if (workout.exercises.length < 3) {
  throw new Error('Mínimo 3 exercícios');
}
await repo.createWorkout(workout);
```

#### 3. Acesso direto a libs externas na UI

```typescript
// ❌ RUIM - UI acessa AsyncStorage diretamente
const HomeScreen = () => {
  useEffect(() => {
    AsyncStorage.getItem('@workouts').then(data => { ... });
  }, []);
};

// ✅ BOM - UI usa repository
const HomeScreen = ({ repo }: { repo: IWorkoutRepo }) => {
  useEffect(() => {
    repo.getAllWorkouts().then(data => { ... });
  }, []);
};
```

#### 4. Adapters com lógica complexa

```typescript
// ❌ RUIM - Adapter com lógica de negócio
static toDomain(dto: WorkoutDTO): WorkoutModel {
  // ❌ Validação de negócio não deveria estar aqui
  if (dto.exercise_list.length === 0) {
    throw new Error('Workout inválido');
  }

  return { ... };
}

// ✅ BOM - Adapter só transforma dados
static toDomain(dto: WorkoutDTO): WorkoutModel {
  return {
    id: dto.workout_id,
    exercises: dto.exercise_list, // transformação simples
  };
}
```

#### 5. Misturar responsabilidades

```typescript
// ❌ RUIM - Repository fazendo múltiplas coisas
export const workoutRepo: IWorkoutRepo = {
	createWorkout: async (workout: CreateWorkoutDTO) => {
		// ❌ Validação (deveria ser Use Case)
		if (!workout.title) throw new Error("...")

		// ❌ Analytics (deveria ser serviço separado)
		trackEvent("workout_created")

		// ❌ Manipulação de UI (deveria ser na tela)
		showToast("Treino criado!")

		// ✅ OK - persistência
		return await save(workout)
	},
}
```

---

## Resumo

A camada **Infra** é a ponte entre o mundo externo (APIs, bancos, serviços, plataformas) e a lógica interna da aplicação (domain). Seguindo os princípios de Clean Architecture e utilizando padrões como Repository e Adapter, conseguimos:

- 🎯 **Desacoplar** a aplicação de libs externas
- 🧪 **Testar** facilmente com mocks de interfaces
- 🔄 **Substituir** implementações sem impacto no domain
- 📦 **Isolar** mudanças em dependências externas
- 🚀 **Manter** código limpo e escalável
- 🌐 **Garantir independência de plataforma** (React, React Native, Node.js)

### Responsabilidade Principal da Infra

**A Infra adapta o mundo externo para que nossa aplicação não dependa de coisas específicas de plataforma.** O mesmo código de domínio e UI core deve funcionar em React, React Native, ou qualquer outro ambiente - a infra se encarrega de fazer as adaptações necessárias (storage, navegação, HTTP, etc).

**Regra de ouro**: Domain define **O QUÊ** fazer, Infra define **COMO** fazer (e adapta para cada plataforma).

---

## Referências

### Arquivos do Projeto

- [`src/domain/Workout/IWorkoutRepo.ts`](../src/domain/Workout/IWorkoutRepo.ts) - Interface do repositório
- [`src/domain/Workout/WorkoutModel.ts`](../src/domain/Workout/WorkoutModel.ts) - Modelo de domínio
- [`src/infra/repos/Workout/WorkoutRepo.ts`](../src/infra/repos/Workout/WorkoutRepo.ts) - Implementação do repositório
- [`src/infra/repos/Workout/WorkoutAdapter.ts`](../src/infra/repos/Workout/WorkoutAdapter.ts) - Adapter API ↔ Domain

### Leitura Recomendada

- **Clean Architecture** - Robert C. Martin (Uncle Bob)
- **Domain-Driven Design** - Eric Evans
- **Repository Pattern** - Martin Fowler
- **Dependency Inversion Principle (SOLID)** - Robert C. Martin
