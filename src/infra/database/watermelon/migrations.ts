import { addColumns, schemaMigrations } from "@nozbe/watermelondb/Schema/migrations"

export default schemaMigrations({
	migrations: [
		{
			toVersion: 2,
			steps: [
				addColumns({
					table: "workouts",
					columns: [
						{
							name: "description",
							type: "string",
							isOptional: false,
						},
					],
				}),
			],
		},
	],
})
