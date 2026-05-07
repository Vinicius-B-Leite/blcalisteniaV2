import { ExerciseModel, IExerciseRepo } from "@/domains/Exercise"
import { ITestableRepository } from "@/tests"
import { AppError } from "@/errors"

const store: ExerciseModel[] = []

let idCounter = 1

export const InMemoryExerciseRepo: IExerciseRepo & ITestableRepository = {
	getAllExercises: async () => {
		try {
			return await new Promise<ExerciseModel[]>((resolve) => {
				setTimeout(() => {
					resolve([...store])
				}, 500)
			})
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
			const newExercise: ExerciseModel = {
				...params,
				id: String(idCounter++),
			}
			store.push(newExercise)
			return newExercise
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
			const index = store.findIndex((e) => e.id === id)
			if (index === -1) {
				throw new AppError({
					message: "Exercício não encontrado",
					property: "exercise",
					statusCode: 404,
				})
			}
			const definedParams = Object.fromEntries(
				Object.entries(params).filter(([, v]) => v !== undefined),
			) as Partial<Omit<ExerciseModel, "id">>
			store[index] = { ...store[index], ...definedParams }
			return store[index]
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao atualizar o exercício",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	seed: async (data) => {
		for (const exercise of data) {
			store.push({
				...exercise,
				id: exercise.id || String(idCounter++),
			})
		}
	},

	deleteExercise: async (id) => {
		try {
			const index = store.findIndex((e) => e.id === id)
			if (index === -1) {
				throw new AppError({
					message: "Exercício não encontrado",
					property: "exercise",
					statusCode: 404,
				})
			}
			store.splice(index, 1)
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao deletar o exercício",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	getById: async (id) => {
		try {
			const exercise = store.find((e) => e.id === id)
			if (!exercise) {
				throw new AppError({
					message: "Exercício não encontrado",
					property: "exercise",
					statusCode: 404,
				})
			}
			return exercise
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao buscar o exercício",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	getManyByIds: async (ids) => {
		try {
			return store.filter((e) => ids.includes(e.id))
		} catch (error) {
			throw new AppError({
				message: "Ocorreu um erro ao buscar os exercícios",
				property: "exercise",
				statusCode: 500,
			})
		}
	},

	clear: async () => {
		store.length = 0
		idCounter = 1
	},
}
