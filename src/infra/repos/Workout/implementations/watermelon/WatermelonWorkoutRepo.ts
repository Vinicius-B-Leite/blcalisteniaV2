import { GetWorkoutsParams, IWorkoutRepo, WorkoutModel } from "@/domains/Workout"
import { database } from "src/infra/database"
import { workoutAdapters } from "../../WorkoutAdapter"
import WorkoutsModel from "src/infra/database/watermelon/models/WorkoutsModel"
import { AppError } from "@/errors"
import { Q } from "@nozbe/watermelondb"
import { PaginatedResult } from "@/types/pagination"

export const WatermelonWorkoutRepo: IWorkoutRepo = {
	getAllWorkouts: async (params: GetWorkoutsParams): Promise<PaginatedResult<WorkoutModel>> => {
		try {
			const { page, limit, searchText } = params
			const conditions: ReturnType<typeof Q.where>[] = []
			if (searchText) {
				conditions.push(
					Q.where("title", Q.like(`%${Q.sanitizeLikeString(searchText)}%`)),
				)
			}
			const workouts = await database.collections
				.get<WorkoutsModel>("workouts")
				.query(...conditions, Q.skip(page * limit), Q.take(limit))
				.fetch()
			return {
				items: workouts.map(workoutAdapters.toDomain),
				hasNextPage: workouts.length === limit,
			}
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao buscar os treinos",
				property: "workout",
				statusCode: 500,
			})
		}
	},

	getWorkoutById: async (id) => {
		try {
			const workout = await database.collections
				.get<WorkoutsModel>("workouts")
				.query(Q.where("id", id))
				.fetch()
				.then((results) => results[0])

			if (!workout) {
				throw new AppError({
					message: "Treino não encontrado",
					property: "workout",
					statusCode: 404,
				})
			}

			return workoutAdapters.toDomain(workout)
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao buscar o treino",
				property: "workout",
				statusCode: 500,
			})
		}
	},

	createWorkout: async (params) => {
		try {
			let createdWorkout: WorkoutsModel | undefined

			await database.write(async () => {
				createdWorkout = await database.collections
					.get<WorkoutsModel>("workouts")
					.create((record) => {
						Object.assign(
							record,
							workoutAdapters.toDTO(params as WorkoutModel),
						)
					})
			})

			return workoutAdapters.toDomain(createdWorkout!)
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao criar o treino",
				property: "workout",
				statusCode: 500,
			})
		}
	},

	deleteWorkout: async (id) => {
		try {
			await database.write(async () => {
				const workout = await database.collections
					.get<WorkoutsModel>("workouts")
					.query(Q.where("id", id))
					.fetch()
					.then((results) => results?.[0])

				if (!workout) {
					throw new AppError({
						message: "Treino não encontrado",
						property: "workout",
						statusCode: 404,
					})
				}

				await workout.markAsDeleted()
			})
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao remover o treino",
				property: "workout",
				statusCode: 500,
			})
		}
	},

	updateWorkout: async (workout) => {
		try {
			const hasWorkout = await WatermelonWorkoutRepo.getWorkoutById(workout.id)

			if (!hasWorkout) {
				throw new AppError({
					message: "Treino não encontrado",
					property: "workout",
					statusCode: 404,
				})
			}

			let updatedWorkout: WorkoutModel | undefined

			await database.write(async () => {
				updatedWorkout = await WatermelonWorkoutRepo.getWorkoutById(workout.id)
			})
			return updatedWorkout!
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao atualizar o treino",
				property: "workout",
				statusCode: 500,
			})
		}
	},
}
