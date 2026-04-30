import { appSchema, tableSchema } from "@nozbe/watermelondb"

export default appSchema({
	version: 4,
	tables: [
		tableSchema({
			name: "users",
			columns: [
				{ name: "name", type: "string" },
				{ name: "created_at", type: "number" },
				{ name: "updated_at", type: "number" },
			],
		}),
		tableSchema({
			name: "workouts",
			columns: [
				{ name: "title", type: "string" },
				{ name: "description", type: "string" },
				{ name: "category", type: "string" },
				{ name: "image_url", type: "string" },
				{ name: "week_days_frequency", type: "string" }, // JSON string
				{ name: "created_at", type: "number" },
				{ name: "updated_at", type: "number" },
			],
		}),
		tableSchema({
			name: "exercises",
			columns: [
				{ name: "name", type: "string" },
				{ name: "user_id", type: "string", isOptional: true },
				{ name: "banner_url", type: "string", isOptional: true },
				{ name: "muscles_groups", type: "string" }, // JSON string
				{ name: "created_at", type: "number" },
				{ name: "updated_at", type: "number" },
			],
		}),
		tableSchema({
			name: "workout_exercises",
			columns: [
				{ name: "workout_id", type: "string" },
				{ name: "exercise_id", type: "string" },
				{ name: "deleted_at", type: "number", isOptional: true },
				{ name: "created_at", type: "number" },
				{ name: "updated_at", type: "number" },
			],
		}),
		tableSchema({
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
})
