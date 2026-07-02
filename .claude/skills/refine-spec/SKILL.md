---
name: refine-spec
description: >
    Recebe uma spec inicial (rascunho, ideia ou documento parcial) e conduz uma
    entrevista estruturada para preencher pontos em aberto, descobrir edge cases e
    firmar decisões de arquitetura. O resultado é uma spec completa, pronta para
    ser passada ao tdd-orchestrator. Use sempre que a spec tiver ambiguidades,
    campos opcionais não definidos, comportamentos ausentes em estados de UI, ou
    decisões de camada ainda não tomadas.
---

# Refine Spec — Da Ideia à Spec Completa

Esta skill transforma uma spec inicial incompleta numa especificação técnica pronta para implementação via TDD. O agente conduz uma **entrevista estruturada** em fases, fazendo perguntas objetivas e registrando as respostas até não restar nenhum ponto em aberto.

---

## Regras Invioláveis

1. **Nunca implemente nada.** Esta skill é exclusivamente de levantamento e documentação.
2. **Nunca assuma respostas.** Se algo não estiver explícito na spec inicial, pergunte.
3. **Faça uma fase de cada vez.** Não avance para a próxima fase sem ter respostas suficientes da fase atual.
4. **Registre as decisões tomadas.** Ao final de cada fase, liste os pontos acordados antes de prosseguir.
5. **Seja cirúrgico.** Se a spec inicial já responde uma questão claramente, não pergunte de novo — apenas confirme e siga.

---

## Fluxo de Trabalho

```
1. Ler a spec inicial
      ↓
2. Fase 1 — Contexto & Visão Geral
      ↓
3. Fase 2 — Fluxos do Usuário
      ↓
4. Fase 3 — Estados da UI
      ↓
5. Fase 4 — Validação & Regras de Negócio
      ↓
6. Fase 5 — Edge Cases
      ↓
7. Fase 6 — Decisões de Arquitetura
      ↓
8. Fase 7 — Testes & Observabilidade
      ↓
9. Gerar a spec refinada (documento final)
```

---

## Fase 1 — Contexto & Visão Geral

**Objetivo:** Entender onde a feature se encaixa no app e qual problema ela resolve.

Perguntar se não estiver claro na spec:

- Em qual tela / rota essa feature vive? É uma tela nova ou uma adição a uma existente?
- Qual é o gatilho do fluxo (botão, navegação automática, deeplink, tab)?
- Qual é o objetivo do usuário ao usar essa feature em uma frase?
- Essa feature substitui algo existente ou é completamente nova?
- Existe algum mockup, wireframe ou tela existente para se basear?

**Gate:** Só avança quando souber a localização no app, o gatilho e o objetivo do usuário.

---

## Fase 2 — Fluxos do Usuário

**Objetivo:** Mapear todos os caminhos que o usuário pode percorrer — happy path e variações.

Perguntar se não estiver claro na spec:

- Descreva o caminho feliz (happy path) passo a passo do ponto de vista do usuário.
- Existem fluxos alternativos? (ex: usuário cancela no meio, volta para a tela anterior)
- Após sucesso, o usuário é redirecionado? Para onde? Com quais parâmetros de rota?
- Existem ações destrutivas (deletar, deslogar)? Há confirmação antes de executá-las?
- A feature requer autenticação? O que acontece se o usuário não estiver logado?
- Existem papéis ou permissões diferentes (ex: exercício criado pelo sistema vs. pelo usuário)?

**Gate:** Só avança quando todos os caminhos principais (incluindo cancelamento e redirecionamento) estiverem definidos.

---

## Fase 3 — Estados da UI

**Objetivo:** Garantir que cada estado visual da tela esteja especificado.

Para cada estado abaixo, perguntar se há tratamento e como ele deve se parecer:

| Estado                   | Pergunta                                                                   |
| ------------------------ | -------------------------------------------------------------------------- |
| **Loading**              | O que aparece enquanto dados carregam? (skeleton, spinner, placeholder?)   |
| **Empty**                | O que aparece quando não há dados? (mensagem, ilustração, CTA?)            |
| **Error**                | O que aparece se a requisição falhar? (toast, inline error, retry button?) |
| **Partial / Paginação**  | A lista pagina? Infinite scroll ou paginação explícita?                    |
| **Otimista**             | A UI atualiza antes de confirmar com o backend (optimistic update)?        |
| **Read-only**            | Algum estado torna campos ou botões desabilitados? Quando?                 |
| **Modal / Bottom Sheet** | Se houver modal: tem overlay? Fecha ao clicar fora? Fecha no back button?  |

**Gate:** Só avança quando loading, empty e error state estiverem definidos para cada operação assíncrona.

---

## Fase 4 — Validação & Regras de Negócio

**Objetivo:** Fechar todas as regras de dado e comportamento de formulários.

Perguntar se não estiver claro na spec:

- Quais campos são obrigatórios? Quais são opcionais?
- Para cada campo obrigatório: qual é a mensagem de erro exibida ao usuário?
- Existe validação de formato (email, URL, número, data)? Qual é a regex/regra?
- Existem limites de tamanho (min/max length, min/max value)?
- Quando a validação é acionada: `onBlur`, `onChange`, `onSubmit`, ou após primeira interação?
- O botão de submit começa habilitado ou desabilitado? Quando muda de estado?
- Existem regras de negócio que dependem do estado de outros campos? (ex: campo B só aparece se A for selecionado)
- Existem transformações nos dados antes de persistir? (ex: trim, lowercase, parse)

**Gate:** Só avança quando cada campo do formulário tiver regra de validação, mensagem de erro e comportamento do submit definidos.

---

## Fase 5 — Edge Cases

**Objetivo:** Descobrir comportamentos em condições de contorno que costumam ser esquecidos.

Apresentar os seguintes cenários e perguntar o comportamento esperado para cada um relevante à feature:

**Dados & Estado:**

- O que acontece se o usuário tentar criar um item que já existe (duplicidade)?
- O que acontece se o item que o usuário tenta editar/deletar for removido por outro processo enquanto ele está na tela?
- Há limite de itens (ex: máximo de exercícios por treino)? O que acontece ao atingir o limite?
- Os dados sobrevivem a um reload do app? Onde são persistidos?

**Rede & Erros:**

- O que acontece se a operação falhar por timeout ou erro de rede?
- A operação pode ser tentada novamente (retry)? Automático ou manual?
- Se a operação for destrutiva (delete), há como desfazer (undo)?

**Concorrência & Sessão:**

- O que acontece se o usuário submeter o formulário duas vezes rapidamente (double tap)?
- O que acontece se o usuário estiver offline?
- O formulário é resetado ao fechar e reabrir o modal/tela?

**Autenticação:**

- Se a sessão expirar durante o uso, o que acontece?
- Os dados visíveis pertencem apenas ao usuário logado ou são compartilhados?

**Gate:** Só avança quando os edge cases relevantes à feature tiverem resposta explícita.

---

## Fase 6 — Decisões de Arquitetura

**Objetivo:** Definir a estrutura de código antes de implementar.

Perguntar se não estiver claro na spec:

**Domain:**

- Quais modelos de domínio estão envolvidos? Precisa criar um novo `Model`?
- Quais operações do repositório são necessárias? (`create`, `update`, `delete`, `findById`, `findAll`, `findByFilter`?)
- Há alguma regra de negócio que deve viver no domain (fora do repositório)?

**Infra:**

- Precisa criar um repositório novo ou aproveitar um existente?
- Quais query keys do React Query são invalidadas após mutações?
- A entidade é persistida no WatermelonDB? Qual schema / migração é necessário? (ver skill `create-watermelon-migration`)

**UI:**

- A tela é nova ou um componente dentro de uma tela existente?
- Quais sub-componentes precisam ser criados (`components/`)?
- O estado lógico vai em `useScreenName.ts` ou em um hook dedicado do componente?
- Reutiliza algum componente core existente (`core/`) ou precisa criar um novo?

**Navegação:**

- Qual é a rota (expo-router path)? É um modal (`presentation: modal`)?
- Quais parâmetros de rota são passados? São obrigatórios ou opcionais?
- Há parâmetros que precisam ser tipados no `_layout.tsx`?

**Gate:** Só avança quando as camadas Domain, Infra e UI estiverem definidas com suas responsabilidades claras.

---

## Fase 7 — Testes & Observabilidade

**Objetivo:** Garantir que a feature seja testável e que os testes cubram o que importa.

Perguntar se não estiver claro:

- Quais são os comportamentos críticos que DEVEM ter teste de integração?
- Quais `testID`s serão necessários? (Listar por elemento interativo e condicional)
- Existem comportamentos que dependem do usuário estar logado? Eles precisam de teste?
- Existem animações ou transições visuais? Elas precisam ser testadas ou podem ser ignoradas por `jest.mock`?
- Há logging de erros necessário? (`console.log`, Sentry, Crashlytics?)

**Gate:** Só avança quando houver pelo menos um caso de teste definido para o happy path e um para o principal error state.

---

## Geração da Spec Refinada

Após coletar todas as respostas, gere um documento markdown estruturado com as seguintes seções:

```markdown
# Technical Specification: [Nome da Feature]

## 1. Visão Geral

[Objetivo em 1-2 frases + localização no app]

## 2. Localização e Estrutura

[Caminhos de arquivo, componentes novos e existentes]

## 3. Fluxos do Usuário

### 3.1 Happy Path

[Passo a passo numerado]

### 3.2 Fluxos Alternativos

[Cancelamento, erros, redirecionamentos]

## 4. Estados da UI

| Estado  | Comportamento |
| ------- | ------------- |
| Loading | ...           |
| Empty   | ...           |
| Error   | ...           |

## 5. Definição do Formulário e Validação

[Tabela de campos, tipos, validações e mensagens de erro]

### Comportamento do Botão Submit

[Estado inicial, quando habilita/desabilita, estado de loading]

## 6. Fluxo de Estado e Persistência

[Reset de estado, integração com backend, sucesso, erro]

## 7. Regras de Negócio e Edge Cases

[Lista de regras e comportamentos em condições de contorno]

## 8. Decisões de Arquitetura

### Domain

[Modelos, interfaces de repositório, use cases]

### Infra

[Repositórios, query keys, invalidações, schema WatermelonDB]

### UI

[Tela, sub-componentes, hooks, navegação]

## 9. Plano de Testes

[Cenários de teste, testIDs necessários]
```

### Onde salvar

Salvar sempre em `docs/specs/{index}-{title}.md`, nunca em `spec.md` na raiz ou em arquivo solto.

- `{index}`: dois dígitos, sequencial dentro de `docs/specs/` (ex: `01`, `02`...). Verificar o maior índice já existente na pasta antes de escrever.
- `{title}`: kebab-case, curto, identificando a feature (ex: `workout-session-dynamic`).

---

## Checklist de Qualidade (antes de entregar a spec)

A spec é, na prática, uma instrução que outros agentes (`tdd-red-agent`, `tdd-green-agent`) vão executar sem nenhum contexto além do próprio documento — trate-a como tal. Antes de considerar a spec pronta, releia-a inteira e verifique cada item abaixo. Se algo falhar, corrija a spec diretamente (não é preciso voltar a perguntar ao usuário, a menos que a correção exija uma decisão nova):

- **Todo prop/tipo usado num exemplo de código tem contrato declarado.** Se um snippet usa `<Componente prop={x} />`, deve existir um `types.ts` (ou definição inline) para esse componente, listado em "Arquivos a criar/modificar". Nunca deixar uma prop "solta" sem type em nenhum lugar da spec.
- **Zero linguagem vaga.** Bandeiras vermelhas: "ou similar", "algo como", "provavelmente", "talvez", "etc." em qualquer decisão de comportamento, texto de cópia ou valor. Presença de hedge é sinal de que uma fase da entrevista ficou incompleta — feche a decisão com um valor exato em vez de deixar em aberto no documento final.
- **Toda afirmação de "segue o mesmo padrão de X" foi verificada de fato**, não assumida por semelhança superficial. Releia o arquivo `X` referenciado e confirme estrutura a estrutura (props, presença de Header, hierarquia de componentes) antes de escrever essa frase. Se for parecido mas não idêntico, explicite a diferença em vez de generalizar — uma comparação errada engana quem for implementar.
- **Nenhuma prop/parâmetro configurável para um valor que só pode assumir uma única opção dentro do escopo atual.** Se algo sempre vale o mesmo valor porque a funcionalidade que o variaria está fora de escopo (ex: um índice sempre fixo em 0 porque navegação não está no escopo), hardcode internamente e documente o porquê — evita over-engineering no agente que for implementar. Se o escopo futuro reintroduzir a variação, a prop pode voltar naquele momento.
- **Arquivos a criar/modificar estão em formato de checklist** (`- [ ] caminho`), não em prosa solta — permite que o agente de implementação rastreie progresso entre sessões/contextos.

---

## Boas Práticas ao Conduzir a Entrevista

- **Agrupe perguntas relacionadas** — não faça uma pergunta por mensagem; envie uma fase por vez.
- **Cite a spec original** — antes de perguntar, mencione o que já está coberto para evitar redundância.
- **Ofereça opções quando possível** — ao invés de perguntas abertas, sugira alternativas comuns: "O botão começa (a) habilitado, (b) desabilitado, ou (c) depende da validação em tempo real?"
- **Registre decisões explicitamente** — ao final de cada fase, escreva: "Decisões desta fase:" com bullets.
- **Sinalize pontos de alto risco** — se um edge case tiver impacto arquitetural significativo, destaque com ⚠️.
- **Não bloqueie em detalhes cosméticos** — cores, fontes, espaçamentos não são bloqueantes para a spec técnica; deixe para o design system.
