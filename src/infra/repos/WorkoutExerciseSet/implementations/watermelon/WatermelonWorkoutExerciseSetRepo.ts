import { IWorkoutExerciseSetRepo } from "@/domains/WorkoutExerciseSet"
import { database } from "@/infra/database"
import WorkoutExerciseSetsModel from "@/infra/database/watermelon/models/WorkoutExerciseSetsModel"
import { workoutExerciseSetAdapters } from "@/repos/WorkoutExercise/WorkoutExerciseAdapter"
import { Q } from "@nozbe/watermelondb"

export const WatermelonWorkoutExerciseSetRepo: IWorkoutExerciseSetRepo = {
	getById: async (id) => {
		try {
			const createdSets = await database.collections
				.get<WorkoutExerciseSetsModel>("workout_exercise_sets")
				.query(Q.where("workout_exercise_id", id), Q.where("deleted_at", null))
				.fetch()

			if (createdSets.length === 0) {
				throw new Error("No workout exercise sets found for ID: " + id)
			}

			return workoutExerciseSetAdapters.toDomain(createdSets[0])
		} catch (error) {
			throw new Error("Error fetching workout exercise set: " + error)
		}
	},
	addSet: async (params) => {
		try {
			let created!: WorkoutExerciseSetsModel

			await database.write(async () => {
				created = await database.collections
					.get<WorkoutExerciseSetsModel>("workout_exercise_sets")
					.create((record) => {
						// @ts-ignore
						record.workoutExercise.id = params.workoutExerciseId
						record.reps = params.reps
						record.rest = params.rest
					})
			})

			return workoutExerciseSetAdapters.toDomain(created)
		} catch (error) {
			throw new Error("Error adding workout exercise set: " + error)
		}
	},
}
