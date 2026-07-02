# Workflow de IA do Projeto

Este documento descreve como usar agentes de IA (Claude Code) para desenvolver features neste projeto, do primeiro rascunho de ideia até o código implementado e testado.

O pipeline tem três etapas sequenciais:

```
brainstorm  →  refine-spec  →  tdd-orchestrator (Red → Green → Refactor)
(conversa)     (spec.md)        (subagentes)
```

Cada etapa tem um propósito específico e um artefato de saída próprio. Pular etapas é permitido para tarefas pequenas (ver [Quando pular etapas](#quando-pular-etapas)), mas o caminho completo é o recomendado para qualquer feature de tamanho médio ou maior.

---

## Visão geral das etapas

| Etapa               | Tipo         | Entrada                              | Saída                                      | Onde fica                  |
| -------------------- | ------------ | ------------------------------------- | ------------------------------------------- | --------------------------- |
| `brainstorm`         | Skill        | Ideia crua, item do `notes.txt`       | Clareza sobre o problema (geralmente nada escrito) | conversa, opcionalmente `docs/brainstorms/` |
| `refine-spec`        | Skill        | Spec inicial incompleta               | Spec técnica completa                       | `docs/specs/{index}-{title}.md` |
| `tdd-orchestrator`   | Agent        | Caminho da spec                       | Feature implementada e testada              | código-fonte em `src/`      |

---

## 1. Brainstorm — pensar antes de formalizar

**Skill:** `.claude/skills/brainstorm/SKILL.md`

Use quando a ideia ainda é rasa: uma frase, um "e se a gente...", um bullet vago do `notes.txt`. O agente age como um colega pensando em voz alta, não como um consultor entregando relatório — respostas curtas (3-6 frases), uma pergunta afiada por vez, opinião própria sobre tradeoffs.

**Não faz:** convocar subagentes, produzir checklists ou "análises completas". Isso é papel das etapas seguintes.

**`notes.txt`** (raiz do repo) funciona como memória viva da sessão — backlog informal com seções como "Em desenvolvimento", "Débitos", "Feat". O brainstorm pode puxar um tópico de lá e, se a ideia amadurecer, pergunta antes de atualizar o arquivo.

**Para onde a conversa vai ao convergir** (decisão do usuário, nunca automática):

- Só anotar e continuar depois → atualiza `notes.txt`
- Já está claro o suficiente pra implementar direto → pula spec/TDD se a feature for pequena
- Vira spec formal → segue para `refine-spec`
- Registrar a discussão em detalhe (só se pedido explicitamente) → salva em `docs/brainstorms/{index}-{nome-em-ingles-kebab-case}.md`

---

## 2. Refine Spec — da ideia à spec completa

**Skill:** `.claude/skills/refine-spec/SKILL.md`

Recebe uma spec inicial (rascunho, ideia, documento parcial) e conduz uma **entrevista estruturada em 7 fases**, uma por vez, até não restar ambiguidade:

1. **Contexto & Visão Geral** — onde a feature vive, gatilho, objetivo do usuário
2. **Fluxos do Usuário** — happy path, cancelamento, redirecionamento, autenticação
3. **Estados da UI** — loading, empty, error, paginação, otimista, read-only, modal
4. **Validação & Regras de Negócio** — campos obrigatórios, mensagens de erro, quando validar
5. **Edge Cases** — duplicidade, concorrência, offline, double-tap, sessão expirada
6. **Decisões de Arquitetura** — Domain / Infra / UI / Navegação
7. **Testes & Observabilidade** — comportamentos críticos, testIDs, logging

Cada fase tem um **gate**: só avança quando as respostas mínimas daquela fase estiverem fechadas. Regra de ouro: **nunca implementa nada** e **nunca assume respostas** — o que não está explícito, pergunta.

**Saída:** documento markdown salvo em `docs/specs/{index}-{title}.md` (índice sequencial de 2 dígitos, título em kebab-case). Antes de entregar, a skill roda um checklist de qualidade — zero linguagem vaga ("ou similar", "provavelmente"), toda prop usada em exemplo tem contrato de tipo, toda comparação "segue o padrão de X" foi verificada de fato no código, arquivos a criar/modificar em formato de checklist (`- [ ] caminho`).

Essa spec é tratada como uma **instrução que outros agentes vão executar sem contexto além do próprio documento** — por isso o rigor.

Exemplo real no repo: [`docs/specs/01-workout-session-dynamic.md`](../specs/01-workout-session-dynamic.md).

---

## 3. TDD Orchestrator — da spec ao código

**Agent:** `.claude/agents/tdd-orchestrator.agent.md`

Recebe o caminho de uma spec e conduz o ciclo **Red → Green → (Refactor opcional)**, delegando cada fase para um subagente isolado e atuando como portão (gate) entre elas. Cada subagente roda com contexto isolado — só vê o que o orquestrador passa explicitamente.

```
spec.md
   ↓
tdd-orchestrator lê a spec, extrai:
  feature, caminho da tela, comportamentos, entidades de domínio, caminho do teste
   ↓
┌─────────────────────────────────────────────────────────┐
│ FASE RED  →  tdd-red-agent                               │
│   escreve __tests__/, constants.ts, __mocks__/            │
│   yarn test <caminho> --no-coverage  (gate: deve FALHAR)  │
└─────────────────────────────────────────────────────────┘
   ↓
 ⏸  PARADA — orquestrador apresenta resumo e pergunta
     se o usuário revisou os testes e quer avançar
   ↓ (confirmação explícita do usuário)
┌─────────────────────────────────────────────────────────┐
│ FASE GREEN  →  tdd-green-agent                            │
│   Domain → Infra → UI, nessa ordem, sem pular camada       │
│   yarn test <dir-da-tela>/ --no-coverage (gate: PASSAR)    │
└─────────────────────────────────────────────────────────┘
   ↓
 ⏸  PARADA — orquestrador pergunta se quer rodar Refactor
   ↓ (se sim)
┌─────────────────────────────────────────────────────────┐
│ FASE REFACTOR  →  tdd-refactor-agent                      │
│   limpa código sem alterar comportamento                  │
│   yarn test <caminho> --no-coverage (gate: continua verde) │
└─────────────────────────────────────────────────────────┘
```

### Fase Red — `tdd-red-agent`

Escreve **somente** artefatos de teste: `__tests__/`, `__mocks__/`, `constants.ts`. Nunca cria stub ou implementação vazia para satisfazer import — o teste deve falhar por ausência real da implementação, nunca por erro de setup/provider. Segue a skill [`tdd-red`](../../.claude/skills/tdd-red/SKILL.md), que por sua vez segue os padrões de [`create-integration-tests`](../../.claude/skills/create-integration-tests/SKILL.md) (asserção por `testID`, nunca por texto; teardown padrão com `asTestableRepository(...).clear()`, `queryClient.clear()`).

Ao final, produz o checklist **Artefatos pendentes para a fase Green** — todo arquivo de produção que precisa existir para os testes passarem.

### Fase Green — `tdd-green-agent`

Implementa o mínimo necessário para os testes passarem, na ordem **Domain → Infra → UI** (nunca pula camada). Nunca modifica arquivo de teste; nunca implementa comportamento não coberto pelos testes existentes; nunca refatora código não relacionado. Roda a suíte completa da tela (não só o arquivo novo) como gate final, para garantir que nada existente quebrou.

### Fase Refactor — `tdd-refactor-agent` (opcional, sempre perguntado)

Limpa o código feito na fase Green — duplicação, nomes, consistência de `stylesTheme`, `any` residual, código morto — sem alterar comportamento nem tocar em testes. Se algum teste quebrar, reverte a alteração imediatamente.

### Regras do orquestrador

- Nunca pula o gate de fase — sempre roda os testes antes de reportar
- Nunca inicia Green automaticamente — exige confirmação explícita do usuário após Red
- Nunca finaliza silenciosamente após Green — sempre pergunta sobre Refactor

---

## Skills de apoio usadas durante a implementação

Os subagentes de TDD (principalmente o Green) recorrem a estas skills conforme a camada sendo implementada — vale conhecê-las mesmo fora do fluxo principal:

| Skill                         | Quando entra em jogo                                                          |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `create-watermelon-migration` | Spec exige nova coluna/tabela — roda **antes** de `create-repos`                |
| `create-repos`                | Camada Infra — repositório InMemory + Watermelon                               |
| `create-use-cases`            | Camada Domain — hooks de use case com React Query                              |
| `create-core-components`      | Componente novo reutilizável em `src/ui/components/` (Compound Pattern)        |
| `create-common-components`    | Sub-componente específico de uma tela                                          |
| `create-form`                 | Feature envolve formulário (RHF + Zod ou estado local)                         |
| `create-integration-tests`    | Base de todo teste escrito na fase Red                                         |

---

## Quando pular etapas

O pipeline completo (`brainstorm → refine-spec → tdd-orchestrator`) é o caminho recomendado para features de tamanho médio ou maior — qualquer coisa que toque múltiplas camadas ou tenha mais de 2-3 estados de UI.

Pular é aceitável quando:

- **A ideia já nasce clara** (bug pontual, ajuste de estilo, comportamento óbvio de 1 tela) → vai direto para implementação, sem forçar spec nem TDD.
- **A spec já está completa** (ex: escrita manualmente, já revisada) → pula `refine-spec` e chama `tdd-orchestrator` direto.

O que **não** deve ser pulado: o gate de revisão humana entre Red e Green, e a pergunta sobre Refactor ao final — isso é regra fixa do orquestrador, independente do tamanho da feature.

---

## Onde cada artefato fica

```
notes.txt                         # backlog informal, memória viva de brainstorms
docs/
├── brainstorms/{i}-{nome}.md     # discussões de brainstorm registradas (só se pedido)
├── specs/{i}-{titulo}.md         # specs técnicas completas, prontas pro orquestrador
└── AIWorkflow/README.md          # este documento
.claude/
├── skills/                       # brainstorm, refine-spec, tdd-red, tdd-green, create-*
└── agents/                       # tdd-orchestrator, tdd-red-agent, tdd-green-agent, tdd-refactor-agent
```
