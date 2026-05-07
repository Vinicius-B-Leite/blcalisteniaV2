import { IExerciseRepo } from "@/domains/Exercise"
import { database } from "@/infra/database"
import ExercisesModel from "@/infra/database/watermelon/models/ExercisesModel"
import { exerciseAdapters } from "../../ExerciseAdapter"
import { Q } from "@nozbe/watermelondb"
import { AppError } from "@/errors"

export const WatermelonExerciseRepo: IExerciseRepo = {
	getAllExercises: async () => {
		try {
			const exercises = await database.collections
				.get<ExercisesModel>("exercises")
				.query()
				.fetch()

			if (!exercises || exercises.length === 0) {
				return []
			}

			return exercises.map(exerciseAdapters.toDomain)
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao buscar os exercícios",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	createExercise: async (params) => {
		try {
			let createdExercise: ExercisesModel

			if (params.userId) {
				const hasUser = await database.collections
					.get("users")
					.query(Q.where("id", params.userId))
					.fetch()

				if (hasUser.length === 0) {
					throw new AppError({
						message: "Usuário não encontrado",
						property: "exercise",
						statusCode: 404,
					})
				}
			}

			await database.write(async () => {
				createdExercise = await database.collections
					.get<ExercisesModel>("exercises")
					.create((record) => {
						const dto = exerciseAdapters.toDTO(params)
						record.name = dto.name!
						record.musclesGroups = dto.musclesGroups!

						if (dto.bannerUrl) {
							record.bannerUrl = dto.bannerUrl
						}

						if (params.userId) {
							// @ts-ignore - Watermelon doesn't recognize the relation field, but it exists in the model
							record.user.id = params.userId
						}
					})
			})

			return exerciseAdapters.toDomain(createdExercise!)
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao criar o exercício",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	updateExercise: async (id, params) => {
		try {
			const record = await database.collections
				.get<ExercisesModel>("exercises")
				.find(id)

			if (!record) {
				throw new AppError({
					message: "Exercício não encontrado",
					property: "exercise",
					statusCode: 404,
				})
			}

			await database.write(async () => {
				await record.update((r) => {
					if (params.name !== undefined) r.name = params.name
					if (params.musclesGroups !== undefined)
						r.musclesGroups = params.musclesGroups
					if (params.bannerUrl !== undefined) r.bannerUrl = params.bannerUrl
				})
			})

			return exerciseAdapters.toDomain(record)
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao atualizar o exercício",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	deleteExercise: async (id) => {
		try {
			const record = await database.collections
				.get<ExercisesModel>("exercises")
				.find(id)

			if (!record) {
				throw new AppError({
					message: "Exercício não encontrado",
					property: "exercise",
					statusCode: 404,
				})
			}

			await database.write(async () => {
				await record.markAsDeleted()
			})
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao deletar o exercício",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	getManyByIds: async (ids) => {
		try {
			const exercises = await database.collections
				.get<ExercisesModel>("exercises")
				.query(Q.where("id", Q.oneOf(ids)))
				.fetch()

			if (!exercises || exercises.length === 0) {
				return []
			}

			return exercises.map(exerciseAdapters.toDomain)
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao buscar os exercícios",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	getById: async (id) => {
		try {
			const records = await database.collections
				.get<ExercisesModel>("exercises")
				.query(Q.where("id", id))
				.fetch()

			if (!records || records.length === 0) {
				throw new AppError({
					message: "Exercício não encontrado",
					property: "exercise",
					statusCode: 404,
				})
			}

			return exerciseAdapters.toDomain(records[0])
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao buscar o exercício",
				property: "exercise",
				statusCode: 500,
			})
		}
	},
}
