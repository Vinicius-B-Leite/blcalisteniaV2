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
		{
			toVersion: 4,
			steps: [
				createTable({
					name: "workout_exercises",
					columns: [
						{ name: "workout_id", type: "string" },
						{ name: "exercise_id", type: "string" },
						{ name: "deleted_at", type: "number", isOptional: true },
						{ name: "created_at", type: "number" },
						{ name: "updated_at", type: "number" },
					],
				}),
				createTable({
					name: "workout_exercise_sets",
					columns: [
						{ name: "workout_exercise_id", type: "string" },
						{ name: "reps", type: "number" },
						{ name: "rest", type: "number" },
						{ name: "deleted_at", type: "number", isOptional: true },
						{ name: "created_at", type: "number" },
						{ name: "updated_at", type: "number" },
					],
				}),
			],
		},
	],
})
