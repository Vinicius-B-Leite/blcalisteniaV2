import { Model } from "@nozbe/watermelondb"
import { date, field, immutableRelation } from "@nozbe/watermelondb/decorators"
import WorkoutExercisesModel from "./WorkoutExercisesModel"

export default class WorkoutExerciseSetsModel extends Model {
	static table = "workout_exercise_sets"

	@field("reps") reps!: number
	@field("rest") rest!: number
	@date("deleted_at") deletedAt!: Date | null
	@date("created_at") createdAt!: Date
	@date("updated_at") updatedAt!: Date

	@immutableRelation("workout_exercises", "workout_exercise_id")
	workoutExercise!: WorkoutExercisesModel
}
