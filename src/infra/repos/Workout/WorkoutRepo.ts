import { IWorkoutRepo } from "src/domain/Workout/IWorkoutRepo"
import { database } from "src/infra/database"
import { workoutAdapters } from "./WorkoutAdapter"
import WorkoutsModel from "src/infra/database/watermelon/models/WorkoutsModel"

export const WorkoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		const workouts = await database.collections
			.get<WorkoutsModel>("workouts")
			.query()
			.fetch()

		if (workouts.length === 0) {
			throw new Error("No workouts found")
		}

		return workouts.map(workoutAdapters.toDomain)
	},
}
