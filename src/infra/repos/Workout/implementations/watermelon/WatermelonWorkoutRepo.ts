import { IWorkoutRepo } from "@/domains/Workout"
import { database } from "src/infra/database"
import { workoutAdapters } from "../../WorkoutAdapter"
import WorkoutsModel from "src/infra/database/watermelon/models/WorkoutsModel"

export const WatermelonWorkoutRepo: IWorkoutRepo = {
	getAllWorkouts: async () => {
		const workouts = await database.collections
			.get<WorkoutsModel>("workouts")
			.query()
			.fetch()

		if (workouts.length === 0) {
			return []
		}

		return workouts.map(workoutAdapters.toDomain)
	},

	getWorkoutById: async (id) => {
		try {
			const workout = await database.collections
				.get<WorkoutsModel>("workouts")
				.find(id)

			if (!workout) {
				throw new Error("Workout not found with ID: " + id)
			}

			return workoutAdapters.toDomain(workout)
		} catch (error) {
			throw new Error("Error fetching workout by ID: " + error)
		}
	},

	createWorkout: async (params) => {
		try {
			let createdWorkout: WorkoutsModel | undefined

			await database.write(async () => {
				createdWorkout = await database.collections
					.get<WorkoutsModel>("workouts")
					.create((record) => {
						Object.assign(record, workoutAdapters.toDTO(params as any))
					})
			})

			return workoutAdapters.toDomain(createdWorkout!)
		} catch (error) {
			throw new Error("Error creating workout: " + error)
		}
	},

	deleteWorkout: async (id) => {
		try {
			const hasWorkout = await WatermelonWorkoutRepo.getWorkoutById(id)

			if (!hasWorkout) {
				throw new Error("Workout not found with ID: " + id)
			}

			await database.write(async () => {
				const workout = await database.collections
					.get<WorkoutsModel>("workouts")
					.find(id)

				await workout.destroyPermanently()
			})
		} catch (error) {
			throw new Error("Error deleting workout: " + error)
		}
	},

	updateWorkout: async (workout) => {
		try {
			const hasWorkout = await WatermelonWorkoutRepo.getWorkoutById(workout.id)

			if (!hasWorkout) {
				throw new Error("Workout not found with ID: " + workout.id)
			}

			let updatedWorkout: WorkoutsModel | undefined

			await database.write(async () => {
				updatedWorkout = await database.collections
					.get<WorkoutsModel>("workouts")
					.find(workout.id)
			})
			return workoutAdapters.toDomain(updatedWorkout!)
		} catch (error) {
			throw new Error("Error updating workout: " + error)
		}
	},
}
