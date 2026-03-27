import { MuscleGroup } from "@/constants"
import { Model } from "@nozbe/watermelondb"
import { date, immutableRelation, json, text } from "@nozbe/watermelondb/decorators"
import UsersModel from "./UsersModel"

export default class ExercisesModel extends Model {
	static table = "exercises"

	@text("name") name!: string
	@text("banner_url") bannerUrl!: string | null
	@json("muscles_groups", (value) => JSON.parse(JSON.stringify(value) ?? "[]"))
	musclesGroups!: MuscleGroup[]
	@date("created_at") createdAt!: Date
	@date("updated_at") updatedAt!: Date

	@immutableRelation("users", "user_id") user!: UsersModel | null
}
