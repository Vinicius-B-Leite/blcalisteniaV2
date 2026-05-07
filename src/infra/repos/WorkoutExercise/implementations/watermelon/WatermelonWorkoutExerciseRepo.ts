import {
	IWorkoutExerciseRepo,
	ExerciseWithWorkoutSetsModel,
} from "@/domains/WorkoutExercise"
import { database } from "@/infra/database"
import WorkoutExercisesModel from "@/infra/database/watermelon/models/WorkoutExercisesModel"
import WorkoutExerciseSetsModel from "@/infra/database/watermelon/models/WorkoutExerciseSetsModel"
import { Q } from "@nozbe/watermelondb"
import {
	workoutExerciseAdapters,
	workoutExerciseSetAdapters,
} from "../../WorkoutExerciseAdapter"
import { WorkoutExerciseSetRepo } from "@/repos/WorkoutExerciseSet"
import { ExerciseRepo } from "@/repos/Exercise"
import { AppError } from "src/errors/AppError"
import { WorkoutRepo } from "@/repos/Workout/implementations"

export const WatermelonWorkoutExerciseRepo: IWorkoutExerciseRepo = {
	addExercise: async (params, sets) => {
		try {
			let createdWorkoutExercise!: WorkoutExercisesModel

			await database.write(async () => {
				createdWorkoutExercise = await database.collections
					.get<WorkoutExercisesModel>("workout_exercises")
					.create((record) => {
						// @ts-ignore
						record.workout.id = params.workoutId
						// @ts-ignore
						record.exercise.id = params.exerciseId
					})
			})

			if (createdWorkoutExercise.id === undefined) {
				throw new AppError({
					message: "Ocorreu um erro ao criar o exercício do treino",
					property: "workoutExercise",
					statusCode: 500,
				})
			}

			try {
				for (const set of sets) {
					await WorkoutExerciseSetRepo.addSet({
						workoutExerciseId: createdWorkoutExercise.id,
						reps: set.reps,
						rest: set.rest,
					})
				}
			} catch (error) {
				throw new AppError({
					message: "Ocorreu um erro ao criar os sets do exercício do treino",
					property: "workoutExerciseSets",
					statusCode: 500,
				})
			}

			const createdSets = await WorkoutExerciseSetRepo.getById(
				createdWorkoutExercise.id,
			)

			return {
				...workoutExerciseAdapters.toDomain(createdWorkoutExercise),
				sets: createdSets,
			}
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao criar o exercício do treino",
				property: "workoutExercise",
				statusCode: 500,
			})
		}
	},

	getExercisesByWorkout: async (workoutId) => {
		try {
			const exercisesIds = await database.collections
				.get<WorkoutExercisesModel>("workout_exercises")
				.query(Q.where("workout_id", workoutId), Q.where("deleted_at", null))
				.fetch()
				.then((records) => records.map((r) => r.exercise.id))

			if (exercisesIds.length === 0) {
				return []
			}

			const exercises = ExerciseRepo.getManyByIds(exercisesIds)

			return exercises
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao buscar os exercícios do treino",
				property: "workoutExercise",
				statusCode: 500,
			})
		}
	},

	getExercisesWithSetsByWorkout: async (workoutId) => {
		try {
			const workoutExists = await WorkoutRepo.getWorkoutById(workoutId)

			if (!workoutExists) {
				throw new AppError({
					message: "Treino não encontrado",
					property: "workout",
					statusCode: 404,
				})
			}

			const workoutExerciseRecords = await database.collections
				.get<WorkoutExercisesModel>("workout_exercises")
				.query(Q.where("workout_id", workoutId), Q.where("deleted_at", null))
				.fetch()

			if (workoutExerciseRecords.length === 0) {
				return []
			}
			const results: ExerciseWithWorkoutSetsModel[] = []

			for (const record of workoutExerciseRecords) {
				const setRecords = await database.collections
					.get<WorkoutExerciseSetsModel>("workout_exercise_sets")
					.query(Q.where("workout_exercise_id", record.id))
					.fetch()

				const exercise = await ExerciseRepo.getById(record.exercise.id)
				if (!exercise) continue

				results.push({
					...exercise,
					workoutExerciseId: record.id,
					sets: setRecords.map(workoutExerciseSetAdapters.toDomain),
				})
			}

			return results
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao buscar os exercícios do treino com sets",
				property: "workoutExercise",
				statusCode: 500,
			})
		}
	},

	updateExerciseSets: async (workoutExerciseId, newSets) => {
		try {
			const existingSets = await database.collections
				.get<WorkoutExerciseSetsModel>("workout_exercise_sets")
				.query(Q.where("workout_exercise_id", workoutExerciseId))
				.fetch()

			await database.write(async () => {
				for (const set of existingSets) {
					await set.destroyPermanently()
				}
			})

			for (const set of newSets) {
				await WorkoutExerciseSetRepo.addSet({
					workoutExerciseId,
					reps: set.reps,
					rest: set.rest,
				})
			}
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao atualizar os sets do exercício do treino",
				property: "workoutExerciseSets",
				statusCode: 500,
			})
		}
	},

	removeExercise: async (workoutExerciseId) => {
		try {
			const existingSets = await database.collections
				.get<WorkoutExerciseSetsModel>("workout_exercise_sets")
				.query(Q.where("workout_exercise_id", workoutExerciseId))
				.fetch()

			const record = await database.collections
				.get<WorkoutExercisesModel>("workout_exercises")
				.find(workoutExerciseId)

			await database.write(async () => {
				for (const set of existingSets) {
					await set.destroyPermanently()
				}
				await record.destroyPermanently()
			})
		} catch (error) {
			throw new Error("Error removing workout exercise: " + error)
		}
	},
}
