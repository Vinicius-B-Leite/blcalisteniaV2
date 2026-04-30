import { MuscleGroup } from "@/constants"
import { Model } from "@nozbe/watermelondb"
import { date, immutableRelation, text } from "@nozbe/watermelondb/decorators"
import ExercisesModel from "./ExercisesModel"
import WorkoutsModel from "./WorkoutsModel"

export default class WorkoutExercisesModel extends Model {
	static table = "workout_exercises"

	@date("deleted_at") deletedAt!: Date | null
	@date("created_at") createdAt!: Date
	@date("updated_at") updatedAt!: Date

	@immutableRelation("workouts", "workout_id") workout!: WorkoutsModel
	@immutableRelation("exercises", "exercise_id") exercise!: ExercisesModel
}
