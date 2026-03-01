import { appSchema, tableSchema } from "@nozbe/watermelondb"

export default appSchema({
	version: 1,
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
				{ name: "category", type: "string" },
				{ name: "image_url", type: "string", isOptional: true },
				{ name: "week_days_frequency", type: "string" }, // JSON string to store weekDaysFrequency
				{ name: "created_at", type: "number" },
				{ name: "updated_at", type: "number" },
			],
		}),
	],
})
