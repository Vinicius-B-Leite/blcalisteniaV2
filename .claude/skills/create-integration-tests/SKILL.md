---
name: create-integration-tests
description: Cria testes de integração para telas seguindo os padrões do projeto com repositórios InMemory, customRender, helpers de repositório testável e gerenciamento de cache do React Query. Use ao criar novos testes de integração para telas, testar mutations/queries, ou quando o usuário perguntar sobre padrões de teste neste projeto.
---

# Criando Testes de Integração (Screen Integration Tests)

Esta skill guia a criação de testes de integração seguindo as convenções do projeto, usando repositórios InMemory, utilitários de renderização customizados e React Testing Library.

## Tecnologias & Stack

- **Jest** (~29.7.0) com preset **jest-expo**
- **@testing-library/react-native** (^13.2.0) — queries e interações com componentes
- **Repositórios InMemory** — selecionados por ambiente via `select.env`
- **React Query** — configurado com `retry: false` e `gcTime: Infinity` no ambiente de teste
- **`customRender`** — envolve componentes com todos os providers do app automaticamente

## Visão Geral da Arquitetura

Os testes de integração exercitam o **slice vertical completo**: UI → hooks de caso de uso → repositório in-memory → cache do React Query. Não há mock de lógica de domínio ou repositórios — apenas dependências externas como navegação (expo-router) são mockadas com `jest.fn()`.

## Estrutura de Arquivos

Cada teste de tela vive junto à tela:

```
src/ui/screens/NomeDaTela/
├── __tests__/
│   └── NomeDaTela.tsx        # Arquivo de teste de integração
├── __mocks__/
│   └── nomeDaTelaMocks.ts    # Dados de fixture estáticos correspondendo aos modelos de domínio
├── constants.ts               # TEST_IDS exportados como objeto com namespace
└── NomeDaTela.tsx             # Componente da tela
```

## Passo a Passo

### 1. Criar Constantes de Test IDs (`constants.ts`)

Todo elemento interativo ou renderizado condicionalmente precisa ter um `testID`. Convenção: prefixo com namespace + nome semântico. IDs dinâmicos usam funções:

```typescript
const prefix = "entity-list-screen"

export const ENTITY_LIST_SCREEN_TEST_IDS = {
	LOADING_STATE: `${prefix}-loading-state`,
	ENTITY_ITEM: `${prefix}-entity-item`,
	EMPTY_STATE: `${prefix}-empty-state`,
	SEARCH_INPUT: `${prefix}-search-input`,
	ENTITY_LIST: `${prefix}-entity-list`,
	DELETE_BUTTON: ({ id }: { id: string }) => `${prefix}-delete-button-${id}`,
	TO_DETAILS_BUTTON: ({ id }: { id: string }) => `${prefix}-to-details-button-${id}`,
}
```

**Regras:**

- Todas as chaves em `SCREAMING_SNAKE_CASE`
- Prefixo em `kebab-case` correspondendo ao nome da tela
- Botões parametrizados recebem `{ id: string }` e retornam string
- IDs são sempre importados de `constants.ts`, nunca hardcodados nos arquivos de teste
- **Sub-componentes de tela importam o `TEST_IDS` da tela diretamente, não recebem `testID` via props.** Passar `testID` como prop expõe detalhe de teste na API do componente — o componente usa a constante internamente:

```typescript
// ✅ correto — componente importa o ID diretamente
import { ENTITY_LIST_SCREEN_TEST_IDS } from "../../constants"

export const EmptyState = () => (
  <View testID={ENTITY_LIST_SCREEN_TEST_IDS.EMPTY_STATE}>...</View>
)

// ❌ errado — testID na API do componente
export const EmptyState = ({ testID }: { testID?: string }) => (
  <View testID={testID}>...</View>
)
```

### 2. Criar Fixtures de Mock (`__mocks__/nomeDaTelaMocks.ts`)

Os dados de fixture devem corresponder exatamente ao shape do **modelo de domínio** (ex: `WorkoutModel`, `ExerciseModel`):

```typescript
import { EntityModel } from "@/domain/Entity/EntityModel"

const entities: EntityModel[] = [
	{
		id: "1",
		title: "Primeira Entidade",
		// ... todos os campos obrigatórios
	},
	{
		id: "2",
		title: "Segunda Entidade",
		// ...
	},
]

export const entityMocks = {
	entities,
}
```

**Quando a entidade tem campos dinâmicos** (ex: `userId` que vem de um `AuthRepo.signInAnonymous`), exporte uma lista base sem esses campos e faça o spread inline no teste:

```typescript
// __mocks__/entityMocks.ts
const userEntitiesBase: Omit<EntityModel, "id" | "userId">[] = [
	{ name: "Entidade do Usuário", ... },
]

export const entityMocks = {
	entities,
	userEntitiesBase,
}

// no arquivo de teste
const user = await AuthRepo.signInAnonymous({ name: "Test User" })
await EntityRepo.createEntity({ ...entityMocks.userEntitiesBase[0], userId: user.id })
```

**Regras:**

- Sempre use IDs hardcodados (`"1"`, `"2"`) para asserções previsíveis
- Exporte um objeto nomeado agrupando todas as fixtures da tela
- **Nunca crie objetos de entidade literais dentro dos `it`s** — defina todos os dados em `__mocks__`, inclusive bases para entidades com campos dinâmicos

### 3. Organizar Testes com `describe` Aninhados

Todo arquivo de teste usa um `describe` global com o nome da tela e, dentro dele, `describe`s filhos para cada contexto funcional da tela. Isso mantém os testes agrupados por responsabilidade e facilita a leitura dos resultados no terminal.

**Estrutura padrão:**

```typescript
describe("Entity List Screen (Integration)", () => {
  beforeEach(async () => {
    await asTestableRepository(EntityRepo).clear()
    queryClient.clear()
    jest.clearAllMocks()
  })

  // General screen tests (loading, empty state, data display)
  it("should show loading state when fetching entities", () => { ... })
  it("should show empty state when there are no entities", async () => { ... })
  it("should show items after loading", async () => { ... })

  describe("search", () => {
    it("should filter items by search text", async () => { ... })
    it("should show empty message when no results found", async () => { ... })
    it("should restore all items when search is cleared", async () => { ... })
  })

  describe("filter", () => {
    it("should filter items by selected category", async () => { ... })
    it("should show all items when filter is removed", async () => { ... })
  })

  describe("deletion", () => {
    it("should open confirmation modal when delete button is pressed", async () => { ... })
    it("should delete item and update the list on confirm", async () => { ... })
    it("should close modal without deleting on cancel", async () => { ... })
  })

  describe("navigation", () => {
    it("should navigate to detail screen with the correct id", async () => { ... })
  })

  describe("pull-to-refresh", () => {
    it("should refresh the list when pull to refresh is triggered", async () => { ... })
  })
})
```

**Regras para nomeação dos `describe`s filhos:**

- Use lowercase names in English: `"search"`, `"filter"`, `"deletion"`, `"navigation"`, `"pull-to-refresh"`, `"creation"`, `"editing"`, `"confirmation modal"`
- Agrupe por **funcionalidade** da tela, não por tipo de asserção
- Só crie um `describe` filho se houver **2 ou mais casos de teste** para aquele contexto — um único `it` deve viver direto no describe pai
- `beforeEach` com seed só faz sentido quando há **múltiplos testes** que compartilham o mesmo estado inicial; para um único teste, use seed inline dentro do próprio `it`
- O `beforeEach` global cobre todos os filhos — não repita nos `describe`s filhos a menos que precise de setup específico

**Exemplo com setup adicional no filho:**

```typescript
describe("Entity List Screen (Integration)", () => {
  beforeEach(async () => {
    await asTestableRepository(EntityRepo).clear()
    queryClient.clear()
    jest.clearAllMocks()
  })

  describe("search", () => {
    beforeEach(async () => {
      // seed data needed for all search tests
      await EntityRepo.createEntity(entityMocks.entities[0])
      await EntityRepo.createEntity(entityMocks.entities[1])
    })

    it("should filter items by search text", async () => { ... })
    it("should restore all items when search is cleared", async () => { ... })
  })
})
```

---

### 4. Escrever o Arquivo de Teste (`__tests__/NomeDaTela.tsx`)

#### Padrão de imports

```typescript
import { act, asTestableRepository, fireEvent, render, screen, waitFor } from "@/tests"
import { ScreenComponent } from "../ScreenComponent"
import { SCREEN_TEST_IDS } from "../constants"
import { EntityRepo } from "@/repos/Entity"
import { entityMocks } from "../__mocks__/entityMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { Router, useRouter } from "expo-router"
```

**Regra importante**: sempre importe `render`, `screen`, `fireEvent`, `waitFor`, `act`, `asTestableRepository` de `@/tests` (nunca diretamente de `@testing-library/react-native`).

#### Mock de navegação (se a tela navega)

```typescript
const mockPush = jest.fn()

jest.mocked(useRouter).mockReturnValue({
	push: mockPush,
} as unknown as Router)
```

#### Mocks globais (`jest.setup.ts`)

Hooks e módulos que **toda tela vai precisar mockar** devem ser configurados uma única vez em `jest.setup.ts`, não repetidos em cada arquivo de teste.

**Regra prática:**

- **`jest.setup.ts`** → mocks de infraestrutura transversal (debounce, roteamento, módulos nativos)
- **Por arquivo de teste** → mocks com retorno específico ao contexto da tela (ex: `jest.mocked(useRouter).mockReturnValue(...)`)

```typescript
// jest.setup.ts — configuração global
jest.mock("expo-router", () => ({
	useRouter: jest.fn(),
}))

jest.mock("@/hooks", () => ({
	...jest.requireActual("@/hooks"),
	useDebounceValue: (value: unknown) => value, // passthrough: sem delay
}))
```

> **Debounce é detalhe de performance, não de lógica.** O mock como passthrough elimina a necessidade de `{ timeout: 2000 }` nos `waitFor` e torna os testes determinísticos. O comportamento real do debounce (delay, cleanup) merece um unit test próprio com `jest.useFakeTimers()`.

#### Teardown no `beforeEach`

```typescript
beforeEach(async () => {
	await asTestableRepository(EntityRepo).clear()
	queryClient.clear()
	jest.clearAllMocks()
})
```

**Sempre nesta ordem:**

1. `asTestableRepository(Repo).clear()` — limpa o store InMemory e reseta o contador de IDs
2. `queryClient.clear()` — invalida o cache do React Query
3. `jest.clearAllMocks()` — reseta o histórico de chamadas dos mocks

#### Padrões de casos de teste

**Estado de carregamento (síncrono — sem await):**

```typescript
	it("should show loading state when fetching entities", () => {
  render(<ScreenComponent />)
  expect(screen.getByTestId(SCREEN_TEST_IDS.LOADING_STATE)).toBeTruthy()
})
```

**Estado vazio (assíncrono):**

```typescript
	it("should show empty state when there are no entities", async () => {
  render(<ScreenComponent />)
  expect(await screen.findByTestId(SCREEN_TEST_IDS.EMPTY_STATE)).toBeTruthy()
})
```

**Exibição de dados após carregamento:**

```typescript
	it("should show items after loading", async () => {
  await EntityRepo.createEntity(entityMocks.entities[0])

  render(<ScreenComponent />)
  expect(screen.getByTestId(SCREEN_TEST_IDS.LOADING_STATE)).toBeTruthy()

  const items = await screen.findAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM)
  expect(items.length).toBeGreaterThan(0)
})
```

**Mutation (delete) with modal confirmation:**

```typescript
it("should delete an entity and update the list", async () => {
  await EntityRepo.createEntity(entityMocks.entities[0])
  render(<ScreenComponent />)

  await screen.findByText(entityMocks.entities[0].title)

  fireEvent.press(
    screen.getByTestId(SCREEN_TEST_IDS.DELETE_BUTTON({ id: entityMocks.entities[0].id }))
  )

  const confirmBtn = await screen.findByTestId(
    SCREEN_TEST_IDS.DELETE_BUTTON({ id: "confirm" })
  )

  await act(async () => {
    await fireEvent.press(confirmBtn)
  })

  await waitFor(async () => {
    expect(screen.queryByText(entityMocks.entities[0].title)).toBeFalsy()
    expect(await screen.findByTestId(SCREEN_TEST_IDS.EMPTY_STATE)).toBeTruthy()
  })
})
```

**Pull-to-refresh:**

```typescript
it("should refresh the list when pull to refresh is triggered", async () => {
  await EntityRepo.createEntity(entityMocks.entities[0])
  render(<ScreenComponent />)

  await screen.findAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM)

  await act(async () => {
    await EntityRepo.createEntity(entityMocks.entities[1])
  })

  const list = screen.getByTestId(SCREEN_TEST_IDS.ENTITY_LIST)
  await act(async () => {
    list.props.refreshControl.props.onRefresh()
  })

  await waitFor(() => {
    expect(screen.getAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM).length).toBe(2)
  })
})
```

**Search / filter (teste o comportamento, não o texto):**

```typescript
it("should filter items by search text and restore all when cleared", async () => {
  await EntityRepo.createEntity(entityMocks.entities[0])
  await EntityRepo.createEntity(entityMocks.entities[1])
  render(<ScreenComponent />)

  await screen.findAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM)

  const searchInput = screen.getByTestId(SCREEN_TEST_IDS.SEARCH_INPUT)
  fireEvent.changeText(searchInput, entityMocks.entities[0].title.substring(0, 5))

  await waitFor(() => {
    expect(screen.getAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM).length).toBe(1)
  })

  fireEvent.changeText(searchInput, "")

  await waitFor(() => {
    expect(screen.getAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM).length).toBe(2)
  })
})
```

> **Nunca use `getByText` para verificar comportamento de filtro.** Prefira contar elementos por `testID`. `getByText` é frágil — quebra com qualquer mudança de copy.

**Se a tela possui múltiplas seções filtráveis (ex: itens default + itens custom), cubra todas no mesmo teste:**

```typescript
it("should filter items by search text across all sections", async () => {
  // seed default items
  await EntityRepo.createEntity(entityMocks.entities[0]) // matches "Flex"
  // seed custom items
  await EntityRepo.createEntity(entityMocks.customEntities[0]) // matches "Custom"
  await EntityRepo.createEntity(entityMocks.customEntities[1]) // matches "Other"

  render(<ScreenComponent />)
  await screen.findAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM)

  const searchInput = screen.getByTestId(SCREEN_TEST_IDS.SEARCH_INPUT)

  // filter that matches only default
  fireEvent.changeText(searchInput, "Flex")
  await waitFor(() => {
    expect(screen.getAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM).length).toBe(1)
    expect(screen.queryAllByTestId(SCREEN_TEST_IDS.CUSTOM_ENTITY_ITEM).length).toBe(0)
  })

  // filter that matches only custom
  fireEvent.changeText(searchInput, "Other")
  await waitFor(() => {
    expect(screen.queryAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM).length).toBe(0)
    expect(screen.getAllByTestId(SCREEN_TEST_IDS.CUSTOM_ENTITY_ITEM).length).toBe(1)
  })

  // clear restores all
  fireEvent.changeText(searchInput, "")
  await waitFor(() => {
    expect(screen.getAllByTestId(SCREEN_TEST_IDS.ENTITY_ITEM).length).toBe(1)
    expect(screen.getAllByTestId(SCREEN_TEST_IDS.CUSTOM_ENTITY_ITEM).length).toBe(2)
  })
})
```

**Navigation assertion:**

```typescript
it("should navigate to detail screen with the correct id when button is pressed", async () => {
  await EntityRepo.createEntity(entityMocks.entities[0])
  await EntityRepo.createEntity(entityMocks.entities[1])
  render(<ScreenComponent />)

  const buttons = await screen.findAllByTestId(
    new RegExp(SCREEN_TEST_IDS.TO_DETAILS_BUTTON({ id: ".*" }))
  )

  fireEvent.press(buttons[1])

  expect(mockPush).toHaveBeenCalledWith({
    pathname: "/(application)/entity/[entityId]",
    params: { entityId: entityMocks.entities[1].id },
  })
})
```

## Requisitos do Repositório InMemory

Todo novo repositório **deve** ter uma implementação InMemory em:

```
src/infra/repos/Entity/implementations/inMemory/InMemoryEntityRepo.ts
```

Deve implementar `IEntityRepo & ITestableRepository`:

```typescript
import { IEntityRepo } from "@/domain/Entity/IEntityRepo"
import { ITestableRepository } from "@/tests"
import { EntityModel } from "@/domain/Entity/EntityModel"

const store: EntityModel[] = []
let idCounter = 1

export const InMemoryEntityRepo: IEntityRepo & ITestableRepository<EntityModel> = {
	// Métodos de domínio
	getAllEntities: async () => {
		return new Promise<EntityModel[]>((resolve) => {
			setTimeout(() => resolve([...store]), 500) // simula latência assíncrona
		})
	},

	createEntity: async (params) => {
		const entity: EntityModel = { ...params, id: String(idCounter++) }
		store.push(entity)
		return entity
	},

	// ITestableRepository
	seed: async (data) => {
		for (const item of data) {
			store.push({ ...item, id: item.id || String(idCounter++) })
		}
	},

	clear: async () => {
		store.length = 0
		idCounter = 1
	},
}
```

**Seleção via `select.env`** em `implementations/index.ts`:

```typescript
import { select } from "@/utils/select"
import { IEntityRepo } from "@/domain/Entity/IEntityRepo"

export const EntityRepo = select.env<IEntityRepo>({
	test: () => require("./inMemory/InMemoryEntityRepo").InMemoryEntityRepo,
	default: () => require("./watermelon/WatermelonEntityRepo").WatermelonEntityRepo,
})
```

## Configuração do React Query para Testes

Em `src/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider.tsx`, o client já está configurado para testes via `select.env`:

```typescript
// Já existe — NÃO alterar
const config = select.env<QueryClientConfig | undefined>({
	test: {
		defaultOptions: {
			queries: { retry: false, gcTime: Infinity },
			mutations: { retry: false, gcTime: Infinity },
		},
	},
	default: undefined,
})
export const queryClient = new QueryClient(config)
```

Garante: sem ruído de retry, cache com vida útil infinita, comportamento assíncrono previsível.

## Checklist Antes de Escrever os Testes

- [ ] `constants.ts` exporta `SCREEN_TEST_IDS` com todas as chaves necessárias
- [ ] Todos os elementos interativos na tela têm `testID` vinculado às constantes
- [ ] `__mocks__/nomeDaTelaMocks.ts` criado com dados de fixture tipados
- [ ] Repositório InMemory implementa tanto a interface de domínio quanto `ITestableRepository`
- [ ] Repositório InMemory selecionado via `select.env` em `implementations/index.ts`
- [ ] `beforeEach` global limpa repo, query client e mocks do jest
- [ ] Navegação mockada com `jest.mocked(useRouter).mockReturnValue`
- [ ] Mocks de infraestrutura transversal (debounce, router) configurados em `jest.setup.ts`, não por arquivo
- [ ] Se a tela tem múltiplos filtros combinados por AND, existe um `it` que aplica todos simultaneamente
- [ ] Todos os imports vêm de `@/tests`, não diretamente de `@testing-library/react-native`
- [ ] `describe` global criado com o nome da tela no formato `"Nome da Tela (Integration)"`
- [ ] `describe`s filhos criados para cada contexto funcional com 2+ casos de teste
- [ ] Coverage da tela >= 80% (statements, branches, functions, lines)

## Pitfalls Conhecidos

### 1. Nunca inspecione o store para verificar mutações — assert na UI

Assertions com `repo.getAll()` dentro de `waitFor` testam detalhe de implementação. O usuário não vê o store — ele vê a lista atualizada na tela.

```typescript
// ❌ errado — detalhe de implementação
await waitFor(async () => {
	const all = await EntityRepo.getAllEntities()
	const updated = all.find((e) => e.id === created.id)
	expect(updated?.name).toBe("Nome Atualizado")
})

// ✅ correto — comportamento visível ao usuário
await waitFor(() => {
	expect(
		screen.getByTestId(SCREEN_TEST_IDS.ENTITY_ITEM_NAME({ id: created.id })).props
			.children,
	).toBe("Nome Atualizado")
})
```

Para viabilizar o assert correto, exponha `testID` nos nós de texto dos itens da lista com escopo de ID:

```typescript
// constants.ts
ENTITY_ITEM_NAME: ({ id }: { id: string }) => `${prefix}-entity-item-name-${id}`,

// componente
<Text testID={SCREEN_TEST_IDS.ENTITY_ITEM_NAME({ id })}>{name}</Text>
```

---

### 2. `formState.isValid` com `zodResolver` é assíncrono — use `waitFor`

`zodResolver` retorna uma `Promise` internamente. Mesmo com Zod síncrono, `isValid` só atualiza após uma microtask. Assertions síncronas após `fireEvent` sempre encontram `isValid=false`.

**Padrão correto para "botão deve estar habilitado":**

```typescript
// após preencher os campos...
await waitFor(() => {
	expect(
		screen.getByTestId(FORM_TEST_IDS.SUBMIT_BUTTON).props.accessibilityState
			?.disabled,
	).toBeFalsy()
})
```

**"Botão deve estar desabilitado quando inválido"** pode ser síncrono — `isValid=false` é o estado inicial estável, não precisa de `waitFor`.

**Sempre aguarde o botão ficar habilitado antes de pressioná-lo em testes de submit:**

```typescript
await waitFor(() => {
	expect(
		screen.getByTestId(FORM_TEST_IDS.SUBMIT_BUTTON).props.accessibilityState
			?.disabled,
	).toBeFalsy()
})

await act(async () => {
	fireEvent.press(screen.getByTestId(FORM_TEST_IDS.SUBMIT_BUTTON))
})
```

---

## Cobertura Mínima (Coverage)

Todo arquivo de tela testado deve atingir **no mínimo 80% de cobertura** em todas as métricas: statements, branches, functions e lines.

Para verificar a cobertura de um arquivo específico:

```bash
yarn test --coverage --collectCoverageFrom="src/ui/screens/NomeDaTela/**/*.{ts,tsx}"
```

---

## Helpers de Teste — DRY

Quando um arquivo de teste repete a mesma sequência de ações em múltiplos `it`s, extraia-a para uma função nomeada. **Coloque os helpers no final do arquivo** — `function` declarations são hoisted, portanto ficam disponíveis em todo o arquivo mesmo declaradas depois do `describe`.

### Candidatos típicos a helper

| Padrão repetido                                                  | Helper sugerido           |
| ---------------------------------------------------------------- | ------------------------- |
| `fireEvent.press(OPEN_BUTTON)` + `findByTestId(MODAL)`           | `openModal()`             |
| `fireEvent.press(EDIT_BUTTON({ id }))` + `findByTestId(MODAL)`   | `openEditModal(id)`       |
| `signInAnonymous` + `repo.create(...)`                           | `createUserEntity()`      |
| `waitFor(() => expect(queryByTestId(MODAL)).toBeFalsy())`        | `expectModalClosed()`     |
| `expect(SUBMIT.props.accessibilityState?.disabled).toBeTruthy()` | `expectSubmitDisabled()`  |
| `waitFor(() => expect(SUBMIT...disabled).toBeFalsy())`           | `expectSubmitEnabled()`   |
| `findAllByTestId(ITEM)` + preenchimento de campos + submit       | `createEntity(name, ...)` |

### Regras

- **Sync vs async**: helpers que só contêm `fireEvent` são `function` simples; helpers com `await` (ex: `findByTestId`, `waitFor`) são `async function`
- **Não abstraia prematuramente**: só extraia quando o bloco aparecer 2+ vezes
- **Nomes descritivos de ação**: `openCreateModal`, `expectModalClosed`, `createUserExercise` — leem como prose no corpo do teste

### Exemplo

```typescript
describe("Entity Modal (Integration)", () => {
	it("should create entity and show in list", async () => {
		render(<Screen />)
		await screen.findAllByTestId(SCREEN_TEST_IDS.ITEM)
		await openCreateModal()
		await createEntity("Nome", ["chest"])
		await expectModalClosed()
	})

	it("should clear form after creation", async () => {
		render(<Screen />)
		await screen.findAllByTestId(SCREEN_TEST_IDS.ITEM)
		await openCreateModal()
		await createEntity("Nome", ["chest"])
		await expectModalClosed()

		await openCreateModal()
		expect(screen.getByTestId(MODAL_TEST_IDS.NAME_INPUT).props.value).toBe("")
		expectSubmitDisabled()
	})
})

// ─── Helpers ────────────────────────────────────────────────────────────────

async function openCreateModal() {
	fireEvent.press(screen.getByTestId(SCREEN_TEST_IDS.CREATE_BUTTON))
	await screen.findByTestId(MODAL_TEST_IDS.MODAL)
}

async function expectModalClosed() {
	await waitFor(() => {
		expect(screen.queryByTestId(MODAL_TEST_IDS.MODAL)).toBeFalsy()
	})
}

function expectSubmitDisabled() {
	expect(
		screen.getByTestId(MODAL_TEST_IDS.SUBMIT_BUTTON).props.accessibilityState?.disabled,
	).toBeTruthy()
}

async function expectSubmitEnabled() {
	await waitFor(() => {
		expect(
			screen.getByTestId(MODAL_TEST_IDS.SUBMIT_BUTTON).props.accessibilityState?.disabled,
		).toBeFalsy()
	})
}

async function createEntity(name: string, muscleGroups: string[]) {
	fireEvent.changeText(screen.getByTestId(MODAL_TEST_IDS.NAME_INPUT), name)
	for (const g of muscleGroups) {
		fireEvent.press(screen.getByTestId(MODAL_TEST_IDS.CHIP({ muscleGroup: g })))
	}
	await expectSubmitEnabled()
	await act(async () => {
		fireEvent.press(screen.getByTestId(MODAL_TEST_IDS.SUBMIT_BUTTON))
	})
}
```

**O que cobrir obrigatoriamente:**

- Estado de carregamento (loading)
- Estado vazio (empty state)
- Exibição de dados após fetch
- Todas as actions do usuário (press, changeText, scroll)
- Todos os fluxos de modal (abrir, confirmar, cancelar)
- Navegação para outras telas

**Branches que costumam passar despercebidas:**

- Renderização condicional (`condition ? <A /> : <B />`) — teste ambos os lados
- Tratamento de erro de mutation — simule falha no repo e verifique feedback ao usuário
- Itens com e sem campos opcionais (ex: `imageUrl` nulo vs preenchido)

### Testes de tratamento de erro (toast de erro)

Quando uma mutation falha, o usuário deve ver uma mensagem de erro no toast. Sempre assert tanto a **presença** do toast quanto o **texto da mensagem** — só verificar a presença não é suficiente.

```typescript
import { TOAST_ROOT_TEST_ID, TOAST_MESSAGE_TEST_ID } from "@/components/core/Toast"

// ✅ correto — verifica presença + mensagem
await screen.findByTestId(TOAST_ROOT_TEST_ID)
expect(screen.getByTestId(TOAST_MESSAGE_TEST_ID).props.children).toBe("Mensagem esperada")

// ❌ insuficiente — só verifica que o toast existe
expect(await screen.findByTestId(TOAST_ROOT_TEST_ID)).toBeTruthy()
```

**Prefira disparar o erro naturalmente via store — sem mock**, quando possível:

```typescript
// Estratégia: seed → render → abrir modal → clear() → confirmar
// O item sumiu do store durante o fluxo → repo lança 404 AppError naturalmente
it("should show error toast when deleting fails", async () => {
	await asTestableRepository(EntityRepo).seed([entityMocks.entities[0]])

	render(<ScreenComponent />)

	const deleteButton = await screen.findByTestId(
		SCREEN_TEST_IDS.DELETE_BUTTON({ id: entityMocks.entities[0].id }),
	)
	fireEvent.press(deleteButton)

	const confirmButton = await screen.findByTestId(
		SCREEN_TEST_IDS.DELETE_BUTTON({ id: "confirm" }),
	)

	await asTestableRepository(EntityRepo).clear() // item desaparece antes da confirmação

	await act(async () => {
		fireEvent.press(confirmButton)
	})

	await screen.findByTestId(TOAST_ROOT_TEST_ID)
	expect(screen.getByTestId(TOAST_MESSAGE_TEST_ID).props.children).toBe(
		"Entidade não encontrada",
	)
})
```

Esse padrão simula concorrência real: o item foi deletado por outro usuário enquanto o modal estava aberto.

**Use mock apenas quando o InMemory não pode falhar naturalmente** (ex: `createEntity` nunca lança em InMemory):

```typescript
jest.spyOn(EntityRepo, "createEntity").mockRejectedValueOnce(
	new AppError({
		message: "Ocorreu um erro ao criar a entidade",
		property: "entity",
		statusCode: 500,
	}),
)
```

**Atenção — `findByTestId` dentro de `waitFor` é sempre truthy (retorna Promise):**

```typescript
// ❌ errado — findByTestId retorna Promise, nunca é falsy
await waitFor(() => {
	expect(screen.findByTestId(TOAST_ROOT_TEST_ID)).toBeTruthy()
})

// ✅ correto — getByTestId é síncrono, lança se não encontrar
await waitFor(() => {
	expect(screen.getByTestId(TOAST_ROOT_TEST_ID)).toBeTruthy()
})
```

## Armadilhas Comuns

| Armadilha                                                                                  | Solução                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Esquecer `queryClient.clear()` no `beforeEach`                                             | Cache stale causa testes instáveis entre execuções                                                                                                                                               |
| Não aguardar `asTestableRepository(Repo).clear()`                                          | Store não ficará vazio — testes compartilham estado                                                                                                                                              |
| Usar `getBy*` para dados assíncronos                                                       | Use `findBy*` que aguarda internamente                                                                                                                                                           |
| Envolver asserções síncronas em `waitFor`                                                  | Use `waitFor` apenas quando o estado muda de forma assíncrona                                                                                                                                    |
| Hardcodar strings de testID nos arquivos de teste                                          | Sempre importar de `constants.ts`                                                                                                                                                                |
| Passar `testID` via prop para componentes de feature                                       | Componentes de feature importam `SCREEN_TEST_IDS` diretamente; props de testID só fazem sentido em componentes genéricos/reutilizáveis da design system                                          |
| Passar string hardcoded de testID ao componente filho                                      | Passe o dado semântico (ex: `muscleGroup`, `id`) e deixe o componente montar o testID internamente via constante                                                                                 |
| Inserir dados no store após `render()`                                                     | Insira antes de renderizar para evitar condições de corrida                                                                                                                                      |
| Agrupar testes não relacionados no mesmo `describe`                                        | Cada `describe` filho deve ter responsabilidade única                                                                                                                                            |
| Repetir `beforeEach` global nos `describe`s filhos                                         | Use `beforeEach` filho apenas para setup adicional exclusivo                                                                                                                                     |
| Criar `describe` filho com apenas um `it`                                                  | Mova o teste diretamente para o describe pai — um describe com um único it não agrega organização                                                                                                |
| Usar `beforeEach` para seed quando há apenas um teste                                      | Coloque o seed inline dentro do `it` — fica mais explícito e elimina o bloco `beforeEach`                                                                                                        |
| Usar `getByText` para verificar resultado de filtro                                        | Conte elementos por `testID` com `getAllByTestId(...).length` — robusto a mudanças de copy                                                                                                       |
| Testar filtro de uma seção ignorando outras seções                                         | Verifique todas as seções filtráveis (ex: default + custom) no mesmo teste para garantir isolamento correto                                                                                      |
| Separar em testes distintos: aplicar filtro / remover filtro                               | Teste o toggle do filtro em sequência no mesmo `it` — aplicar → verificar → remover → verificar restauração                                                                                      |
| Usar `{ timeout: 2000 }` em `waitFor` para compensar debounce                              | Mock `useDebounceValue` como passthrough em `jest.setup.ts` — elimina delays artificiais e torna os testes determinísticos                                                                       |
| Repetir mocks de infraestrutura (`useDebounceValue`, `useRouter`) em cada arquivo de teste | Configure-os uma única vez em `jest.setup.ts` — aplica globalmente sem duplicação                                                                                                                |
| Ter múltiplos filtros na tela sem testar a combinação deles                                | Adicione um `it` que aplica todos os filtros simultaneamente — cada filtro pode funcionar isolado mas falhar em conjunto (AND silencioso)                                                        |
| Criar objetos de entidade literais dentro dos `it`s                                        | Defina todos os dados em `__mocks__`; para campos dinâmicos (ex: `userId`) exporte uma lista base (`userEntitiesBase`) e faça spread inline: `{ ...mocks.userEntitiesBase[0], userId: user.id }` |
| Assertar apenas presença do toast de erro (`toBeTruthy()`)                                 | Sempre assertar também o texto da mensagem via `TOAST_MESSAGE_TEST_ID` — a presença sem o conteúdo não valida o contrato de erro                                                                 |
| Usar mock para erro de delete/update quando o InMemory já lança 404                        | Use `asTestableRepository(Repo).clear()` entre abrir o modal e confirmar — dispara o erro naturalmente sem mock, simulando concorrência real                                                     |
| Usar `screen.findByTestId` dentro de `waitFor`                                             | `findByTestId` retorna Promise (sempre truthy) — use `screen.getByTestId` (síncrono, lança se ausente) dentro de `waitFor`                                                                       |
