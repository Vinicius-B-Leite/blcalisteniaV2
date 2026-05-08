import { GetWorkoutsParams, IWorkoutRepo } from "@/domains/Workout"
import { WorkoutModel } from "@/domains/Workout/WorkoutModel"
import { ITestableRepository } from "@/tests"
import { AppError } from "@/errors"
import { PaginatedResult } from "@/types/pagination"

const store: WorkoutModel[] = []

let idCounter = 1

export const InMemoryWorkoutRepo: IWorkoutRepo & ITestableRepository = {
	getAllWorkouts: async (params: GetWorkoutsParams): Promise<PaginatedResult<WorkoutModel>> => {
		try {
			const { page, limit, searchText } = params
			let filtered = [...store]
			if (searchText) {
				const lower = searchText.toLowerCase()
				filtered = filtered.filter((w) => w.title.toLowerCase().includes(lower))
			}
			const start = page * limit
			const items = filtered.slice(start, start + limit)
			return { items, hasNextPage: items.length === limit }
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
			const workout = store.find((w) => w.id === id)
			if (!workout) {
				throw new AppError({
					message: "Treino não encontrado",
					property: "workout",
					statusCode: 404,
				})
			}
			return workout
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
			const newWorkout: WorkoutModel = { ...params, id: String(idCounter++) }
			store.push(newWorkout)
			return newWorkout
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
			const index = store.findIndex((w) => w.id === id)
			if (index === -1) {
				throw new AppError({
					message: "Treino não encontrado",
					property: "workout",
					statusCode: 404,
				})
			}
			store.splice(index, 1)
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
			const index = store.findIndex((w) => w.id === workout.id)
			if (index === -1) {
				throw new AppError({
					message: "Treino não encontrado",
					property: "workout",
					statusCode: 404,
				})
			}
			store[index] = { ...workout }
			return store[index]
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

	seed: async (data) => {
		for (const workout of data) {
			store.push({
				...workout,
				id: workout.id || String(idCounter++),
			})
		}
	},

	clear: async () => {
		store.length = 0
		idCounter = 1
	},
}
