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

	seed: async (data) => {
		for (const exercise of data) {
			store.push({
				...exercise,
				id: exercise.id || String(idCounter++),
			})
		}
	},

	clear: async () => {
		store.length = 0
		idCounter = 1
	},
}
