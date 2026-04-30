import {
	IWorkoutExerciseSetRepo,
	WorkoutExerciseSetModel,
} from "@/domains/WorkoutExerciseSet"
import { ITestableRepository } from "@/tests"

const store: WorkoutExerciseSetModel[] = []
let idCounter = 1

export const InMemoryWorkoutExerciseSetRepo: IWorkoutExerciseSetRepo &
	ITestableRepository = {
	addSet: async (params) => {
		const newSet: WorkoutExerciseSetModel = {
			...params,
			id: String(idCounter++),
		}
		store.push(newSet)
		return newSet
	},

	getById: async (id) => {
		const set = store.find((s) => s.id === id)
		if (!set) {
			throw new Error("Workout exercise set not found")
		}
		return set
	},

	seed: async (data) => {
		for (const set of data) {
			store.push({
				...set,
				id: set.id || String(idCounter++),
			})
		}
	},

	clear: async () => {
		store.length = 0
		idCounter = 1
	},
}
