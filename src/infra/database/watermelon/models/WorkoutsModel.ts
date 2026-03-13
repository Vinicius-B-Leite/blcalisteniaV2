import { WeekDaysFrequency } from "@/domains/Workout"
import { Model } from "@nozbe/watermelondb"
import { date, json, text } from "@nozbe/watermelondb/decorators"

export default class WorkoutsModel extends Model {
	static table = "workouts"

	@text("title") title!: string
	@text("description") description!: string
	@text("category") category!: string
	@text("image_url") imageUrl!: string
	@json("week_days_frequency", (value) => JSON.parse(JSON.stringify(value) ?? "[]"))
	weekDaysFrequency!: WeekDaysFrequency[]
	@date("created_at") createdAt!: Date
	@date("updated_at") updatedAt!: Date
}
