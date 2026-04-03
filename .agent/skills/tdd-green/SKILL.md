---
name: tdd-green
description: "Modo TDD Green Phase — Implementa o código de produção para fazer os testes existentes passarem. Use após a fase Red (skill tdd) quando já existem testes falhando. O agente implementa SOMENTE o necessário para os testes passarem, sem over-engineering. Segue a ordem: domain → infra → UI, rodando os testes a cada passo."
---

# TDD — Green Phase (Fazer os Testes Passarem)

Esta skill é a **fase Green** do TDD. O agente implementa o código de produção **mínimo necessário** para fazer os testes existentes passarem. Nenhum código extra, nenhuma feature adicional.

## Pré-requisito

Os testes já devem existir (criados pela skill [tdd](../tdd/SKILL.md)). Antes de começar, o agente **deve ler os arquivos de teste** para entender exatamente o que precisa ser implementado.

## Regras Invioláveis

1. **NUNCA modifique os testes.** Os arquivos em `__tests__/`, `__mocks__/` e `constants.ts` de teste são intocáveis. Se um teste parece errado, pare e avise o usuário.
2. **Implemente SOMENTE o necessário para os testes passarem.** Sem funcionalidades extras, sem "melhorias", sem refactoring de código existente que não é relacionado à feature.
3. **Rode os testes a cada etapa concluída** para validar o progresso. Use `yarn test <caminho-do-arquivo-de-teste> --no-coverage` para feedback rápido.
4. **Siga a ordem de implementação**: Domain → Infra → UI. Nunca pule camadas.
5. **Respeite os padrões existentes do projeto.** Cada camada tem convenções — siga o que já existe, não invente padrões novos.
6. **Todo testID usado nos testes deve existir no código.** Leia `constants.ts` e os testes para saber exatamente quais `testID`s vincular nos componentes.

## Fluxo de Trabalho

### 1. Ler os testes e mapear os artefatos necessários

Antes de escrever qualquer código:

- Ler o arquivo de teste completo
- Ler o `constants.ts` dos test IDs
- Ler os mocks em `__mocks__/`
- Montar uma lista de todos os artefatos que precisam ser criados ou modificados

### 2. Implementar na ordem correta

A implementação **sempre** segue esta ordem, de dentro para fora:

```
1. Domain (Model, Interface do Repo, Use Cases)
     ↓
2. Infra (InMemory Repo, seleção via select.env, Provider)
     ↓
3. UI (Hook da tela, Componente da tela, Componentes filhos)
```

### 3. Rodar os testes ao final de cada camada

Após implementar cada camada, rodar os testes para verificar progresso:

```bash
yarn test <caminho-do-teste> --no-coverage
```

---

## Camada 1: Domain

### Model (`src/domain/Entity/EntityModel.ts`)

O model é a tipagem da entidade. Deve corresponder exatamente ao shape usado nos mocks do teste.

```typescript
export type EntityModel = {
	id: string
	name: string
	// campos conforme os mocks do teste
}
```

**Regra:** olhe o arquivo `__mocks__` do teste para saber os campos e tipos exatos.

### Interface do Repositório (`src/domain/Entity/IEntityRepo.ts`)

A interface define os métodos que o repositório deve implementar. Para saber quais métodos criar, procure no teste por chamadas a `EntityRepo.*`:

```typescript
import { EntityModel } from "./EntityModel"

export interface IEntityRepo {
	getAllEntities(): Promise<EntityModel[]>
	createEntity(params: Omit<EntityModel, "id">): Promise<EntityModel>
	// adicione somente os métodos que os testes utilizam
}
```

### Use Cases (`src/domain/Entity/useCases/`)

Cada use case é um hook que expõe `execute` e `isLoading`:

**Query (leitura):**

```typescript
import { useAppQuery } from "@/hooks"
import { useEntityRepo, entityQueryKeys } from "@/repos/Entity"
import { EntityModel } from "../EntityModel"

export const useGetEntities = () => {
	const entityRepo = useEntityRepo()

	const { data, isLoading } = useAppQuery<EntityModel[]>({
		queryKey: [entityQueryKeys.all],
		queryFn: () => entityRepo.getAllEntities(),
		onError: (err) => {
			console.log("Error fetching entities :(", err)
		},
	})

	return { data: data || [], isLoading }
}
```

**Mutation (escrita):**

```typescript
import { useAppMutation } from "@/hooks"
import { useEntityRepo, entityQueryKeys } from "@/repos/Entity"
import { EntityModel } from "../EntityModel"
import { useQueryCache } from "@/infra/services"

export const useCreateEntity = () => {
	const entityRepo = useEntityRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<EntityModel, Omit<EntityModel, "id">>({
		mutationFn: (variables) => entityRepo.createEntity(variables),
		onSuccess: () => {
			queryCacheService.invalidateCacheSingle([entityQueryKeys.all])
		},
		onError: (err) => {
			console.log("Error creating entity :(", err)
		},
	})

	return { execute, isLoading }
}
```

### Index de exportação (`src/domain/Entity/index.ts`)

```typescript
export * from "./EntityModel"
export * from "./IEntityRepo"
export * from "./useCases"
```

---

## Camada 2: Infra

### InMemory Repo (`src/infra/repos/Entity/implementations/inMemory/InMemoryEntityRepo.ts`)

Implementa a interface do domínio + `ITestableRepository`. Deve ter delay assíncrono nos métodos de leitura para simular latência real:

```typescript
import { EntityModel, IEntityRepo } from "@/domains/Entity"
import { ITestableRepository } from "@/tests"

const store: EntityModel[] = []
let idCounter = 1

export const InMemoryEntityRepo: IEntityRepo & ITestableRepository = {
	getAllEntities: async () => {
		return await new Promise<EntityModel[]>((resolve) => {
			setTimeout(() => resolve([...store]), 500)
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

**Regra:** implemente somente os métodos que existem na interface do domínio + `seed` e `clear`. Para métodos de update, verifique se o teste chama `EntityRepo.updateEntity()` — se não chama, não implemente.

### Seleção via `select.env` (`src/infra/repos/Entity/implementations/index.ts`)

```typescript
import { IEntityRepo } from "@/domains/Entity"
import { select } from "@/utils"

const EntityRepo = select.env<IEntityRepo>({
	test: () => require("./inMemory/InMemoryEntityRepo").InMemoryEntityRepo,
	default: () => require("./watermelon/WatermelonEntityRepo").WatermelonEntityRepo,
})

export { EntityRepo }
```

**Nota:** se o repo Watermelon não existe ainda, aponte `default` para InMemory temporariamente. O teste roda em ambiente `test`, então `default` não será executado nos testes.

### Query Keys (`src/infra/repos/Entity/EntityQueryKeys.ts`)

```typescript
export const entityQueryKeys = {
	all: "entities" as const,
}
```

### Repo Provider (`src/infra/repos/Entity/EntityRepoProvider.tsx`)

```typescript
import { createContext, useContext } from "react"
import { IEntityRepo } from "@/domains/Entity"

const EntityRepoContext = createContext({} as IEntityRepo)

export const EntityRepoProvider = EntityRepoContext.Provider

export const useEntityRepo = () => {
	const context = useContext(EntityRepoContext)
	if (!context) {
		throw new Error("useEntityRepo must be used within an EntityRepoProvider")
	}
	return context
}
```

### Index de exportação (`src/infra/repos/Entity/index.ts`)

```typescript
export { EntityRepo } from "./implementations"
export { useEntityRepo, EntityRepoProvider } from "./EntityRepoProvider"
export { entityQueryKeys } from "./EntityQueryKeys"
```

### Registrar no ReposProviders (`src/infra/repos/ReposProviders.tsx`)

Adicionar o novo Provider ao wrapper se for um repo novo:

```typescript
import { EntityRepoProvider } from "./Entity/EntityRepoProvider"
import { EntityRepo } from "./Entity"

// Dentro do JSX, envolver os children:
<EntityRepoProvider value={EntityRepo}>
  {children}
</EntityRepoProvider>
```

---

## Camada 3: UI

### Hook da tela (`useNomeDaTela.ts`)

O hook deve expor exatamente os `states` e `actions` que a tela e os testes precisam. Verifique as interações nos testes para saber quais funções e estados criar:

- `fireEvent.press(...)` → precisa de uma action
- `fireEvent.changeText(...)` → precisa de state + setter ou `form.control`
- `screen.getByTestId(...).props.accessibilityState?.disabled` → precisa de um estado booleano
- `screen.getByTestId(...).props.value` → precisa de state controlado

### Componente da tela (`NomeDaTela.tsx`)

**Regras de testID:**

- Todo `testID` usado nos testes (`constants.ts`) deve existir no JSX
- Componentes de feature **importam** os test IDs diretamente de `constants.ts`, não recebem por prop
- Componentes genéricos/reutilizáveis recebem `testID` via prop
- Para testIDs dinâmicos (ex: `DELETE_BUTTON({ id })`), passe o dado semântico (id) ao componente filho e deixe ele montar o testID internamente

**Regras de `disabled`:**

- Se o teste verifica `accessibilityState?.disabled`, o componente deve receber a prop `disabled`:
    ```tsx
    <Button.Root disabled={isSubmitDisabled} ... />
    ```
    O componente `Button.Root` deve propagar `disabled` para `accessibilityState`.

**Regras de `value`:**

- Se o teste verifica `.props.value`, o input deve ser controlado:
    ```tsx
    <TextInput value={name} onChangeText={setName} testID={TEST_IDS.NAME_INPUT} />
    ```

### Componentes filhos (`components/`)

- Crie somente os componentes que os testes exercitam
- Componentes que o teste não exercita diretamente podem ser inline no componente pai
- Componentes de modal devem renderizar condicionalmente (test verifica `queryByTestId` retornando `null`)

---

## Checklist Final

Após implementar tudo:

- [ ] Todos os testes passam com `yarn test <caminho-do-teste> --no-coverage`
- [ ] Nenhum arquivo de teste foi modificado
- [ ] Nenhum código além do necessário foi adicionado
- [ ] Todos os `testID`s de `constants.ts` estão vinculados no JSX
- [ ] InMemory repo implementa a interface de domínio + `ITestableRepository`
- [ ] InMemory repo selecionado via `select.env` no `implementations/index.ts`
- [ ] Use cases usam `useAppQuery` (leitura) ou `useAppMutation` (escrita)
- [ ] Mutation invalida o cache com `queryCacheService.invalidateCacheSingle`
- [ ] Novo repo registrado no `ReposProviders.tsx` (se aplicável)
- [ ] Nenhum `console.log` de debug deixado no código

## Armadilhas Comuns

| Armadilha                                         | Solução                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Adicionar features além do que os testes pedem    | Implemente SOMENTE o que o teste exerce — nada a mais                           |
| Modificar testes para facilitar a implementação   | Os testes são imutáveis na Green phase                                          |
| Esquecer de invalidar cache após mutation         | `queryCacheService.invalidateCacheSingle([queryKeys.all])` no `onSuccess`       |
| Esquecer `setTimeout` no InMemory repo de leitura | Sem delay, o loading state não aparece e os testes de loading falham            |
| Criar componente sem `testID`                     | Todo elemento verificado no teste precisa de `testID` — consulte `constants.ts` |
| Prop `disabled` não propaga `accessibilityState`  | Verificar implementação do componente base (`Button.Root`)                      |
| Input não controlado (sem `value` prop)           | Se o teste verifica `.props.value`, o input deve ser controlado                 |
| Não registrar o repo no `ReposProviders`          | O hook `useEntityRepo()` vai retornar `{}` e os métodos vão falhar              |

## Skills

Skills disponíveis em `.agent/skills/`. **Leia o `SKILL.md` correspondente antes de executar a tarefa.**

| Skill                      | Arquivo                                                     | Quando usar                                                       |
| -------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `create-core-components`   | [SKILL.md](.agent/skills/create-core-components/SKILL.md)   | Criar componentes core (Compound Pattern, Context API, variantes) |
| `create-comumn-components` | [SKILL.md](.agent/skills/create-comumn-components/SKILL.md) | Criar componentes comuns de tela (hook, styles, types)            |
| `create-integration-tests` | [SKILL.md](.agent/skills/create-integration-tests/SKILL.md) | Criar testes de integração para telas                             |
| `create-repos`             | [SKILL.md](.agent/skills/create-repos/SKILL.md)             | Criar repositório (inMemory + Watermelon)                         |
| `create-use-cases`         | [SKILL.md](.agent/skills/create-use-cases/SKILL.md)         | Criar use cases com React Query                                   |
| `create-form`              | [SKILL.md](.agent/skills/create-form/SKILL.md)              | Criar formulários (React Hook Form + Zod ou estado local)         |
