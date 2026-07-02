---
name: create-watermelon-migration
description: Cria ou altera tabelas do WatermelonDB — adicionar coluna a uma tabela existente, criar uma tabela nova, ou adicionar/ajustar o Model class correspondente. Cobre schema.ts, migrations.ts e os decorators de Model. Use quando a feature exigir uma mudança de schema (novo campo, nova entidade persistida) antes de implementar o repositório com create-repos.
---

# Criando Migrations do WatermelonDB

Esta skill cobre a única parte do fluxo de dados que `create-repos` não cobre: como alterar o schema físico do banco (`schema.ts` + `migrations.ts`) e o `Model` que representa uma tabela. Sempre que uma spec exigir um campo novo ou uma entidade nova persistida, comece aqui — **depois** disso, siga `create-repos` para o Adapter/Repo/QueryKeys/Provider.

## Arquivos envolvidos

```
src/infra/database/watermelon/
├── schema.ts        # Definição atual de todas as tabelas (fonte da verdade do estado FINAL)
├── migrations.ts     # Histórico de mudanças de versão (schemaVersion N-1 → N)
├── sqlite.ts          # Wiring do adapter + registro dos Model classes
└── models/
    ├── WorkoutsModel.ts
    ├── ExercisesModel.ts
    ├── WorkoutExercisesModel.ts
    ├── WorkoutExerciseSetsModel.ts
    └── UsersModel.ts
```

`schema.ts` e `migrations.ts` são **independentes e ambos obrigatórios** — `schema.ts` descreve o estado atual (usado em instalações novas do app), `migrations.ts` descreve como chegar lá a partir de versões antigas (usado em upgrades de app já instalado). Uma mudança de schema que não tem migration correspondente quebra o app pra quem já tem o app instalado.

## Passo a passo

### 1. Decida o tipo de mudança

- **Coluna nova em tabela existente** → `addColumns` na migration + adicionar a coluna em `schema.ts`
- **Tabela nova** → `createTable` na migration + adicionar o `tableSchema` em `schema.ts` + criar o `Model` + registrar em `sqlite.ts`

### 2. Bump da versão em `schema.ts`

O `version` em `appSchema({ version: N, ... })` **sempre** incrementa em 1 a cada mudança de schema — nunca pule números, nunca reaproveite uma versão já usada.

```typescript
// src/infra/database/watermelon/schema.ts
import { appSchema, tableSchema } from "@nozbe/watermelondb"

export default appSchema({
	version: 5, // era 4 — incrementou porque adicionamos algo
	tables: [
		// ...tabelas existentes, inalteradas...
		tableSchema({
			name: "workouts",
			columns: [
				{ name: "title", type: "string" },
				{ name: "description", type: "string" },
				{ name: "category", type: "string" },
				{ name: "image_url", type: "string" },
				{ name: "week_days_frequency", type: "string" }, // JSON string
				{ name: "notes", type: "string", isOptional: true }, // ← coluna nova
				{ name: "created_at", type: "number" },
				{ name: "updated_at", type: "number" },
			],
		}),
	],
})
```

Tipos de coluna válidos: `"string"`, `"number"`, `"boolean"`. Não existe tipo `Date`/`JSON` nativo — datas são `number` (timestamp) e objetos/arrays são `string` (JSON serializado).

### 3. Adicionar o step em `migrations.ts`

O `toVersion` do novo step **deve ser exatamente** a versão que você acabou de definir em `schema.ts`.

```typescript
// src/infra/database/watermelon/migrations.ts
import {
	addColumns,
	createTable,
	schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations"

export default schemaMigrations({
	migrations: [
		// ...steps existentes (toVersion: 2, 3, 4), nunca editar os já existentes...
		{
			toVersion: 5,
			steps: [
				addColumns({
					table: "workouts",
					columns: [{ name: "notes", type: "string", isOptional: true }],
				}),
			],
		},
	],
})
```

**Para tabela nova**, o step é `createTable` com a mesma definição de colunas que foi para `schema.ts`:

```typescript
{
  toVersion: 5,
  steps: [
    createTable({
      name: "workout_notes",
      columns: [
        { name: "workout_id", type: "string" },
        { name: "content", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
},
```

### 4. Criar/atualizar o `Model`

Decorators disponíveis em `@nozbe/watermelondb/decorators`:

| Decorator | Uso | Exemplo real no projeto |
|---|---|---|
| `@text(coluna)` | campo string | `@text("title") title!: string` |
| `@field(coluna)` | campo number/boolean | `@field("reps") reps!: number` |
| `@date(coluna)` | timestamp → `Date` | `@date("created_at") createdAt!: Date` |
| `@json(coluna, sanitizer)` | JSON string → objeto/array | `@json("week_days_frequency", (v) => JSON.parse(JSON.stringify(v) ?? "[]")) weekDaysFrequency!: WeekDaysFrequency[]` |
| `@immutableRelation(tabela, coluna_fk)` | relação 1:1 somente leitura | `@immutableRelation("workout_exercises", "workout_exercise_id") workoutExercise!: WorkoutExercisesModel` |

Exemplo completo (tabela nova `workout_notes`):

```typescript
// src/infra/database/watermelon/models/WorkoutNotesModel.ts
import { Model } from "@nozbe/watermelondb"
import { date, immutableRelation, text } from "@nozbe/watermelondb/decorators"
import WorkoutsModel from "./WorkoutsModel"

export default class WorkoutNotesModel extends Model {
	static table = "workout_notes"

	@text("content") content!: string
	@date("created_at") createdAt!: Date
	@date("updated_at") updatedAt!: Date

	@immutableRelation("workouts", "workout_id")
	workout!: WorkoutsModel
}
```

Coluna adicionada a uma tabela existente → só adicione o `@decorator` correspondente no `Model` já existente daquela tabela.

### 5. Registrar tabela nova em `sqlite.ts`

Só necessário para tabela nova — coluna nova em tabela existente não precisa tocar aqui.

```typescript
// src/infra/database/watermelon/sqlite.ts
import WorkoutNotesModel from "./models/WorkoutNotesModel"

export const database = new Database({
	adapter,
	modelClasses: [
		UsersModel,
		WorkoutsModel,
		ExercisesModel,
		WorkoutExercisesModel,
		WorkoutExerciseSetsModel,
		WorkoutNotesModel, // ← novo
	],
})
```

### 6. Continue em `create-repos`

Com schema, migration e Model prontos, siga a skill `create-repos` para: Adapter (`toDomain`/`toDTO` referenciando as colunas snake_case que você definiu aqui), Repo, QueryKeys e Provider.

## Regras Invioláveis

- **Nunca edite um step de migration já existente** (`toVersion` já commitado) — quem já tem o app instalado nessa versão já rodou aquele step; editar retroativamente causa dessincronia entre o schema de quem já migrou e quem vai migrar agora
- **`schema.ts` e `migrations.ts` sempre mudam juntos** — um sem o outro quebra ou instalações novas (sem migration = irrelevante) ou upgrades (sem mudança no schema.ts final = o app não sabe que a coluna deveria existir)
- `toVersion` da migration deve bater exatamente com `version` do `schema.ts`
- Nomes de coluna são **snake_case** no banco (`workout_id`), o `Model` expõe a propriedade em **camelCase** (`workoutId`) via o decorator — o Adapter (`create-repos`) é quem faz essa ponte pro domínio

## Erros Comuns

1. **Coluna nova com `isOptional: false` (ou omitido, que default é `false`)** — linhas já existentes no banco não têm valor para essa coluna; o SQLite vai ter `NULL` nelas independente do que o schema declara. O schema.ts do próprio projeto já cometeu isso (`description` em `workouts`, `toVersion: 2`) — trate como `isOptional: true` no schema E defenda contra `null`/`undefined` no Adapter (`toDomain`), a não ser que você tenha certeza de que não existem linhas antigas (ex: recurso lançado nesta mesma versão).
2. **Esquecer de rodar `yarn push-check`/testar após a migration** — erro de digitação em nome de coluna entre `schema.ts` e `migrations.ts` não dá erro de TypeScript (são strings), só aparece em runtime.
3. **Criar o `Model` mas esquecer de registrar em `modelClasses` no `sqlite.ts`** — a tabela existe no SQLite mas o WatermelonDB não sabe mapeá-la, e `database.collections.get("nova_tabela")` falha silenciosamente ou lança erro só em runtime.
4. **Reaproveitar ou pular um número de `toVersion`** — o WatermelonDB aplica migrations sequencialmente; um gap ou duplicata trava o upgrade de quem estiver numa versão antiga.

## Checklist

- [ ] `schema.ts`: `version` incrementado em 1
- [ ] `schema.ts`: tabela/coluna nova adicionada na definição final
- [ ] `migrations.ts`: novo step com `toVersion` igual à nova versão do schema
- [ ] Coluna nova em tabela existente → `isOptional: true` a menos que se prove que não há linhas antigas
- [ ] `Model` criado ou atualizado com os decorators corretos
- [ ] Tabela nova → `Model` registrado em `modelClasses` (`sqlite.ts`)
- [ ] Seguiu para `create-repos` para Adapter/Repo/QueryKeys/Provider
