# blcalisteniaV2 — Project Guidelines

App de calistenia em React Native (Expo) com Clean Architecture + DDD, WatermelonDB e React Query.

## Comandos

```bash
yarn test                        # roda todos os testes (jest-expo)
yarn test <path> --no-coverage   # roda um arquivo de teste específico
yarn test <dir>/ --no-coverage   # roda a suite completa de uma tela
yarn push-check                  # type-check TypeScript (sem emit)
yarn start                       # servidor de desenvolvimento Expo
```

## Arquitetura

Separação estrita em 3 camadas — nunca pule camadas:

| Camada         | Caminho                      | Responsabilidade                                                             |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Domain         | `src/domain/{Feature}/`      | Tipos (`Model`), interface do repositório (`IRepo`), hooks de use-case       |
| Infrastructure | `src/infra/repos/{Feature}/` | Implementações do repositório (inMemory + Watermelon), query keys, provider  |
| UI             | `src/ui/screens/{Screen}/`   | Componente da tela, sub-componentes, `constants.ts` (test IDs), `__tests__/` |

Cada Feature em `src/infra/repos/{Feature}/` contém:

- `EntityRepo.ts` — Seleciona InMemory ou Watermelon por ambiente
- `EntityAdapters.ts` — `toDomain()` e `toDTO()` para conversão DB ↔ Domain
- `EntityQueryKeys.ts` — Chaves React Query centralizadas
- `EntityRepoProvider.tsx` — Context + `useEntityRepo()` hook

Detalhes da camada Infra: [.agent/docs/infra.md](.agent/docs/infra.md)

## Estrutura de Tela

```
ScreenName/
├── ScreenName.tsx           # Componente fino — apenas JSX
├── useScreenName.ts         # Hook com toda lógica e estado
├── constants.ts             # TEST_IDS (prefixo kebab-case da tela)
├── styles.ts                # stylesTheme(theme) → StyleSheet
├── components/              # Sub-componentes específicos da tela
├── __tests__/               # Testes de integração
└── __mocks__/               # Fixtures correspondendo ao domain model
```

## Path Aliases

```
@/domains/*    → src/domain/*
@/repos/*      → src/infra/repos/*
@/screens/*    → src/ui/screens/*
@/components/* → src/ui/components/*
@/themes/*     → src/ui/theme/*
@/hooks        → src/hooks
@/utils        → src/utils
@/tests        → src/tests
@/infra/*      → src/infra/*
@/constants    → src/constants
```

## Regras Gerais

- **Nunca use `any`** — sempre tipar explicitamente
- Nunca pule camadas da arquitetura (UI não acessa repo diretamente, etc.)
- **Ordem de implementação de features: Domain → Infra → UI** — nunca comece pela UI
- Estilos são sempre factories temáticas: `export const stylesTheme = (theme: ThemeType) => StyleSheet.create({...})`
- Tokens de espaçamento: `spacings.gap[N]`, `spacings.padding[N]`, `spacings.margin[N]`, `radius[N]`

## Componentes Core Disponíveis

Antes de criar um componente, verifique se ele já existe em `src/ui/components/`:

| Componente  | Padrão de uso                                                    | Notas                                       |
| ----------- | ---------------------------------------------------------------- | ------------------------------------------- |
| `Button`    | `<Button.Root> <Button.Content /></Button.Root>`                 | Compound Pattern                            |
| `Icon`      | `<Icon name="edit" size={20} variant="default" />`               | Ver nomes válidos abaixo                    |
| `Input`     | `<Input.Root> <Input.Label /> <Input.Field /></Input.Root>`      | Compound Pattern; `Input.Error` para erros  |
| `Modal`     | `<Modal.Root> <Modal.Header /> <Modal.Content /></Modal.Root>`   | Compound Pattern                            |
| `Pressable` | `<Pressable.Root onPress={...}> ... </Pressable.Root>`           | Use no lugar de `TouchableOpacity`          |
| `Screen`    | `<Screen> ... </Screen>`                                         | Wrapper de tela com SafeArea e scroll       |
| `Text`      | `<Text variant="..."> ... </Text>`                               | Nunca use `<Text>` nativo do RN diretamente |
| `Header`    | `<Header.Root> <Header.GoBack /> <Header.Title /></Header.Root>` | Compound Pattern                            |
| `Skeleton`  | `<Skeleton width={...} height={...} />`                          | Estado de carregamento                      |

### Ícones disponíveis

Nomes válidos para `<Icon name="..." />` — **não invente nomes fora desta lista**:

```
notification  clock        dumbbells  play       return
notes         arrowRightTop heart      eye        home
calendar      user          leftArrow  x          trash
search        edit          plus       attach
```

## Testes

Os testes são de **integração vertical** (UI → use cases → InMemory repo → React Query). Leia o skill antes de criar testes.

### Utilitários principais

- `customRender()` de `@/tests` — envolve automaticamente todos os providers (QueryCache, Theme, SafeArea, Repos, Image, Auth). **Sempre atualizar `customRender` ao adicionar um novo provider ao app.**
- `asTestableRepository(Repo).seed([...])` / `.clear()` — pre-popula ou limpa stores
- `queryClient` de `@/tests` — limpar entre testes com `queryClient.clear()`

### Teardown padrão

```typescript
beforeEach(async () => {
	await asTestableRepository(EntityRepo).clear() // limpa o repo da feature sendo testada
	await AuthRepo.logout() // só incluir se a feature depende de auth
	queryClient.clear()
	jest.clearAllMocks()
})
```

### Convenção de Test IDs

```typescript
// constants.ts
const prefix = "workout-list-screen"
export const WORKOUT_LIST_SCREEN_TEST_IDS = {
	ITEM: `${prefix}-item`,
	DELETE_BUTTON: ({ id }: { id: string }) => `${prefix}-delete-button-${id}`, // IDs dinâmicos são funções
}
```

### Assertions

- ✅ `queryAllByTestId(ID).length` para contagem de elementos
- ✅ `.props.accessibilityState?.disabled` para estado desabilitado
- ❌ Nunca use `getByText()` para verificar comportamento

## Pitfalls Comuns

- **`customRender` desatualizado** — Se adicionar provider ao app sem atualizar `customRender`, os testes falharão com erros de contexto
- **Violação de camadas** — Use cases acessam repos via `useEntityRepo()` hooks; telas só acessam domain hooks
- **Fixture shape** — Fixtures de mock devem corresponder ao shape do domain model; use `Omit<...>` para campos dinâmicos como `userId`

## Agentes

Agentes disponíveis em `.claude/agents/`. Use o `tdd-orchestrator` para implementar uma feature completa a partir de uma spec.

| Agente               | Arquivo                                            | Quando usar                                                                      |
| -------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `tdd-orchestrator`   | [agent](.claude/agents/tdd-orchestrator.agent.md)   | Implementar uma feature do zero via TDD (Red → Green)                            |
| `tdd-red-agent`      | [agent](.claude/agents/tdd-red-agent.agent.md)      | Subagente interno — escreve apenas os testes (não invocar diretamente)           |
| `tdd-green-agent`    | [agent](.claude/agents/tdd-green-agent.agent.md)    | Subagente interno — implementa para os testes passarem (não invocar diretamente) |
| `tdd-refactor-agent` | [agent](.claude/agents/tdd-refactor-agent.agent.md) | Invocar após a fase Green para limpar o código sem quebrar testes                |

**Uso:** invoque o `tdd-orchestrator` passando o caminho da spec.

### Workflow completo

> Se a spec ainda não está clara, use a skill `refine-spec` antes de iniciar.

```
1. Escreva a spec da feature (spec.md ou arquivo separado)
      ↓
2. Invoque o tdd-orchestrator passando o caminho da spec: spec.md
      ↓
3. Orquestrador lê a spec e delega para tdd-red-agent
   → cria __tests__/, constants.ts, __mocks__/
   → executa yarn test (gate: testes devem FALHAR)
      ↓
4. Orquestrador apresenta resumo e pergunta explicitamente se pode avançar
   → você revisa os testes e confirma
      ↓
5. Após sua confirmação, orquestrador invoca tdd-green-agent
   → tdd-green-agent implementa Domain → Infra → UI
   → executa yarn test (gate: testes devem PASSAR)
      ↓
6. Relatório final: arquivos criados por camada + contagem de testes
      ↓
7. Orquestrador pergunta explicitamente se deseja rodar a fase Refactor
   → (se sim) invoca `tdd-refactor-agent` para limpar o código
   → refatora sem alterar comportamento
   → executa yarn test (gate: todos devem continuar verdes)
```

## Skills

Skills disponíveis em `.claude/skills/`. **Leia o `SKILL.md` correspondente antes de executar a tarefa.**

| Skill                      | Arquivo                                                     | Quando usar                                                                                                |
| -------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `create-core-components`   | [SKILL.md](.claude/skills/create-core-components/SKILL.md)   | Criar componentes core (Compound Pattern, Context API, variantes)                                          |
| `create-common-components` | [SKILL.md](.claude/skills/create-common-components/SKILL.md) | Criar componentes comuns de tela (hook, styles, types)                                                     |
| `create-integration-tests` | [SKILL.md](.claude/skills/create-integration-tests/SKILL.md) | Criar testes de integração para telas                                                                      |
| `create-repos`             | [SKILL.md](.claude/skills/create-repos/SKILL.md)             | Criar repositório (inMemory + Watermelon)                                                                  |
| `create-watermelon-migration` | [SKILL.md](.claude/skills/create-watermelon-migration/SKILL.md) | Alterar schema do WatermelonDB (coluna/tabela nova) e migration — usar antes de `create-repos`             |
| `create-use-cases`         | [SKILL.md](.claude/skills/create-use-cases/SKILL.md)         | Criar use cases com React Query                                                                            |
| `create-form`              | [SKILL.md](.claude/skills/create-form/SKILL.md)              | Criar formulários (React Hook Form + Zod ou estado local)                                                  |
| `tdd-red`                  | [SKILL.md](.claude/skills/tdd-red/SKILL.md)                  | Fase Red do TDD — escrever testes que falham                                                               |
| `tdd-green`                | [SKILL.md](.claude/skills/tdd-green/SKILL.md)                | Fase Green do TDD — implementar o mínimo para os testes passarem                                           |
| `refine-spec`              | [SKILL.md](.claude/skills/refine-spec/SKILL.md)              | Refinar spec inicial — entrevista estruturada para fechar requisitos, edge cases e decisões de arquitetura |
| `brainstorm`               | [SKILL.md](.claude/skills/brainstorm/SKILL.md)               | Debater ideias ainda cruas como um colega, antes de virar spec — puxa contexto de `notes.txt`              |
