import { Model } from "@nozbe/watermelondb"
import { date, text } from "@nozbe/watermelondb/decorators"

export default class UsersModel extends Model {
	static table = "users"

	@text("name") name!: string
	@date("created_at") createdAt!: Date
	@date("updated_at") updatedAt!: Date
}
