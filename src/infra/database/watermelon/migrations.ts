import {
	addColumns,
	createTable,
	schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations"

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
		{
			toVersion: 3,
			steps: [
				createTable({
					name: "exercises",
					columns: [
						{ name: "name", type: "string" },
						{ name: "user_id", type: "string", isOptional: true },
						{ name: "banner_url", type: "string", isOptional: true },
						{ name: "muscles_groups", type: "string" },
						{ name: "created_at", type: "number" },
						{ name: "updated_at", type: "number" },
					],
				}),
			],
		},
	],
})
