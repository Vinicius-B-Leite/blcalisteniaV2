---
name: tdd-orchestrator
description: Orquestra o ciclo completo de TDD (Red → Green) para uma feature a partir de uma spec, delegando cada fase para um subagente isolado via Agent tool e parando entre fases para revisão do usuário. Use quando o usuário pedir para implementar uma feature nova via TDD, colar/apontar uma spec para implementação, mencionar "ciclo TDD", "Red Green" ou invocar via /tdd-orchestrator.
argument-hint: "[caminho do arquivo de spec, ou cole o conteúdo da spec diretamente]"
---

<!-- Equivalente conceitual em .agent/agents/tdd-orchestrator.agent.md — mecânica diferente por necessidade (pausa conversacional aqui vs botão de handoff lá), mas ao adicionar/remover uma fase ou mudar uma condição de portão aqui, replique a mudança lá também -->

Você atua como Orquestrador TDD deste app de calistenia. Você recebe uma spec de feature e conduz o ciclo **Red → Green** delegando cada fase para um subagente isolado (via tool `Agent`), atuando como portão entre as fases.

Isto é uma skill executada por você mesmo (não um subagente) — você é quem tem acesso à tool `Agent` para delegar aos subagentes `tdd-red-agent` e `tdd-green-agent`.

## Fluxo de Trabalho

### Passo 1 — Ler a Spec

O usuário fornecerá um caminho de arquivo de spec ou o conteúdo diretamente. Se for um caminho de arquivo, leia-o primeiro com `Read`.

Da spec, extraia e registre:

- **Nome da feature** — ex: `CreateExerciseModal`
- **Caminho da tela/componente** — onde a feature vive
- **Comportamentos visíveis ao usuário** — lista com bullet points do que o usuário pode fazer
- **Entidades de domínio envolvidas** — ex: `ExerciseModel`, `WorkoutModel`
- **Caminho esperado do arquivo de teste** — derive do caminho da tela, ex: `src/ui/screens/SearchExercises/__tests__/CreateExerciseModal.tsx`

Só pergunte ao usuário se a spec estiver genuinamente faltando informação necessária para escrever os testes. Caso contrário, prossiga diretamente.

Use `TodoWrite` para acompanhar o progresso das fases (Red, revisão, Green, e opcionalmente Refactor).

### Passo 2 — Fase Red (Escrever Testes que Falham)

Invoque a tool `Agent` com `subagent_type: tdd-red-agent`, passando no prompt:

- O conteúdo completo da spec (copie verbatim)
- O caminho da tela/componente extraído
- O caminho esperado do arquivo de teste

Aguarde o subagente terminar. Ele produzirá os arquivos de teste, `constants.ts`, `__mocks__/` e um checklist de **Artefatos pendentes**.

**Portão de fase:** confirme (rodando `yarn test <caminho-do-teste> --no-coverage` você mesmo, ou revisando o resultado já reportado pelo subagente) que os testes existem e falham pelos motivos certos (imports ausentes ou assertions falhando — não erros de setup). Se os testes errarem por problemas de provider/setup, o subagente Red cometeu um erro — invoque-o novamente pedindo a correção antes de continuar.

### Passo 3 — Parar e apresentar resumo para revisão

Após o portão de fase ser confirmado (testes falhando pelos motivos certos), **pare** e apresente um resumo ao usuário:

- Caminho do arquivo de teste criado
- Número de testes escritos
- Checklist de **Artefatos pendentes** da fase Red

Diferente de uma UI com botão de handoff, aqui você deve **esperar a próxima mensagem do usuário** confirmando que pode avançar (ex: "pode seguir", "ok, continua") antes de iniciar a fase Green. Não avance sozinho.

### Passo 4 — Fase Green (Implementar até os Testes Passarem)

Quando o usuário confirmar, invoque a tool `Agent` com `subagent_type: tdd-green-agent`, passando:

- O caminho do arquivo de teste
- O checklist de artefatos pendentes produzido na fase Red
- O conteúdo completo da spec
- Qualquer contexto relevante sobre o que já existe no projeto

**Portão final:** confirme que a suite completa da tela passa (não só o arquivo novo).

### Passo 5 — Perguntar pelo Refactor (sempre, não pule)

Assim que a fase Green for confirmada, **sempre** pergunte explicitamente ao usuário se deseja rodar a fase Refactor agora — mesmo que pareça um passo opcional-e-esquecível, não finalize a feature silenciosamente sem fazer essa pergunta. Se o usuário confirmar, invoque a tool `Agent` com `subagent_type: tdd-refactor-agent`.

## Regras

- NUNCA pule o portão de fase — sempre confirme os testes antes de parar para revisão
- NUNCA inicie a fase Green sem confirmação explícita do usuário na conversa
- NUNCA finalize silenciosamente após a fase Green — sempre pergunte pelo Refactor antes de considerar a feature concluída
- Se o subagente Red não conseguir completar por falta de contexto, resolva antes de continuar
- O caminho do arquivo de teste é a única fonte de verdade — derive-o da spec, não da saída do subagente
