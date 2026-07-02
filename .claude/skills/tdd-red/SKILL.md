---
name: tdd
description: "Modo TDD (Test-Driven Development). Quando ativada, o agente DEVE escrever SOMENTE testes — nunca código de implementação. Use ao iniciar uma feature nova seguindo TDD, ao pedir testes antes da implementação, ou ao mencionar 'TDD'. O agente segue o ciclo Red do TDD: escreve testes que falham, sem tocar no código de produção."
---

# TDD — Test-Driven Development (Red Phase Only)

Esta skill coloca o agente em **modo TDD estrito**. O agente escreve **somente testes** — nunca código de implementação, componentes, hooks, repositórios ou qualquer artefato de produção.

## Regras Invioláveis

Estas regras **NÃO PODEM SER QUEBRADAS** sob nenhuma circunstância:

1. **NUNCA escreva código de implementação.** Nenhum componente, hook, screen, use case, repositório, model, ou qualquer arquivo que não seja de teste.
2. **NUNCA modifique arquivos de produção existentes** para fazer testes passarem. O objetivo é que os testes **falhem** (Red phase).
3. **NUNCA crie stubs, mocks temporários ou implementações vazias** para satisfazer imports — os testes devem referenciar os módulos reais que ainda não existem.
4. **Escreva testes como se a feature já estivesse implementada.** Os testes descrevem o comportamento esperado, não o estado atual do código.
5. **Um teste por comportamento.** Cada `it` testa uma única responsabilidade. Não agrupe comportamentos não relacionados.
6. **Todos os testes devem falhar.** Se um teste passa sem implementação, ele não está testando nada útil — remova ou reescreva.

## O que o agente DEVE fazer

- Criar arquivos de teste (`__tests__/*.tsx`)
- Criar constantes de test IDs (`constants.ts`)
- Criar fixtures de mock (`__mocks__/*.ts`)
- Definir a estrutura de `describe`/`it` completa para a feature
- Importar módulos que ainda não existem (o teste vai falhar no import — isso é esperado)
- Listar ao final quais arquivos de produção precisam ser criados para os testes passarem

## O que o agente NÃO DEVE fazer

- Criar ou modificar componentes de tela (`.tsx` fora de `__tests__/`)
- Criar ou modificar hooks, use cases, repos, models
- Criar implementações InMemory de repos novos
- Alterar `_layout.tsx`, rotas, providers, ou qualquer configuração de app
- Sugerir implementação "só para o teste compilar"
- Rodar os testes (eles vão falhar — esse é o ponto)

## Fluxo de Trabalho

### 1. Entender a feature

Antes de escrever qualquer teste, o agente deve:

- Perguntar SEMPRE qual o comportamento esperado da feature
- Identificar quais entidades de domínio estão envolvidas
- Mapear as interações do usuário (press, input, scroll, navigate)
- Listar os estados da tela (loading, empty, data, error)

### 2. Criar os arquivos de suporte ao teste

Seguindo os padrões da skill [create-integration-tests](../create-integration-tests/SKILL.md):

**`constants.ts`** — Test IDs para todos os elementos interativos e condicionais da feature.

**`__mocks__/nomeDaTelaMocks.ts`** — Fixtures tipadas correspondendo ao modelo de domínio.

### 3. Escrever os testes

Seguir integralmente os padrões documentados na skill [create-integration-tests](../create-integration-tests/SKILL.md) para:

- Estrutura de imports
- Mock de navegação
- Teardown no `beforeEach`
- Organização de `describe`s aninhados
- Padrões de casos de teste (loading, empty state, data display, mutations, search/filter, navigation, pull-to-refresh)
- Asserções por `testID`, nunca por texto

### 4. Gerar o relatório de pendências

Ao final, o agente DEVE listar **todos os artefatos de produção** que precisam ser criados para os testes passarem. Formato:

```
## Artefatos pendentes para a fase Green

### Arquivos novos a criar:
- [ ] `src/ui/screens/NomeDaTela/NomeDaTela.tsx` — Componente da tela
- [ ] `src/domain/Entity/EntityModel.ts` — Modelo de domínio (se novo)
- [ ] `src/domain/Entity/IEntityRepo.ts` — Interface do repositório (se novo)
- [ ] `src/domain/Entity/useCases/useGetEntities.ts` — Use case de listagem
- [ ] `src/infra/repos/Entity/implementations/inMemory/InMemoryEntityRepo.ts` — Repo InMemory

### Arquivos existentes a modificar:
- [ ] `src/ui/screens/NomeDaTela/NomeDaTela.tsx` — Adicionar testIDs nos elementos: [lista dos testIDs]
- [ ] `src/app/(application)/(tabs)/...` — Registrar rota da nova tela

### Comportamentos esperados (resumo):
- A tela deve exibir loading enquanto busca dados
- A tela deve exibir empty state quando não há dados
- A tela deve listar N itens após o carregamento
- ...
```

## Exemplo Completo

Para uma feature "Tela de listagem de programas de treino":

O agente criaria **apenas**:

```
src/ui/screens/ProgramList/
├── __tests__/
│   └── ProgramList.test.tsx    ← TESTE (agente cria)
├── __mocks__/
│   └── programListMocks.ts     ← FIXTURE (agente cria)
└── constants.ts                ← TEST IDS (agente cria)
```

E **NÃO** criaria:

```
src/ui/screens/ProgramList/
└── ProgramList.tsx              ✗ NÃO CRIAR

src/domain/Program/
├── ProgramModel.ts              ✗ NÃO CRIAR
├── IProgramRepo.ts              ✗ NÃO CRIAR
└── useCases/
    └── useGetPrograms.ts        ✗ NÃO CRIAR

src/infra/repos/Program/         ✗ NÃO CRIAR
```

## Referência

Para todos os padrões de teste (imports, estrutura, assertions, repositórios InMemory, configuração de React Query, checklist, armadilhas), consulte a skill completa: [create-integration-tests](../create-integration-tests/SKILL.md).
