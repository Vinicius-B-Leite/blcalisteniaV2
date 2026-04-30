import { ExerciseModel, IExerciseRepo } from "@/domains/Exercise"
import { ITestableRepository } from "@/tests"

const store: ExerciseModel[] = []

let idCounter = 1

export const InMemoryExerciseRepo: IExerciseRepo & ITestableRepository = {
	getAllExercises: async () => {
		return await new Promise<ExerciseModel[]>((resolve) => {
			setTimeout(() => {
				resolve([...store])
			}, 500)
		})
	},

	createExercise: async (params) => {
		const newExercise: ExerciseModel = {
			...params,
			id: String(idCounter++),
		}
		store.push(newExercise)
		return newExercise
	},

	updateExercise: async (id, params) => {
		const index = store.findIndex((e) => e.id === id)
		if (index === -1) {
			throw new Error(`Exercise with id ${id} not found`)
		}
		const definedParams = Object.fromEntries(
			Object.entries(params).filter(([, v]) => v !== undefined),
		) as Partial<Omit<ExerciseModel, "id">>
		store[index] = { ...store[index], ...definedParams }
		return store[index]
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
		const index = store.findIndex((e) => e.id === id)
		if (index === -1) {
			throw new Error(`Exercise with id ${id} not found`)
		}
		store.splice(index, 1)
	},

	getById: async (id) => {
		return store.find((e) => e.id === id) ?? null
	},

	getManyByIds: async (ids) => {
		return store.filter((e) => ids.includes(e.id))
	},

	clear: async () => {
		store.length = 0
		idCounter = 1
	},
}
