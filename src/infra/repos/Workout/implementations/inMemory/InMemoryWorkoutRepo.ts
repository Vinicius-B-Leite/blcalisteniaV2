import { IWorkoutRepo } from "@/domains/Workout"
import { WorkoutModel } from "@/domains/Workout/WorkoutModel"
import { ITestableRepository } from "@/tests"

const store: WorkoutModel[] = []

let idCounter = 1

export const InMemoryWorkoutRepo: IWorkoutRepo & ITestableRepository = {
	getAllWorkouts: async () => {
		return await new Promise<WorkoutModel[]>((resolve) => {
			setTimeout(() => {
				resolve([...store])
			}, 500)
		})
	},

	getWorkoutById: async (id) => {
		return store.find((w) => w.id === id)
	},

	createWorkout: async (params) => {
		const newWorkout: WorkoutModel = { ...params, id: String(idCounter++) }
		store.push(newWorkout)
		return newWorkout
	},

	deleteWorkout: async (id) => {
		const index = store.findIndex((w) => w.id === id)
		if (index === -1) {
			throw new Error("Workout not found with ID: " + id)
		}
		store.splice(index, 1)
	},

	updateWorkout: async (workout) => {
		const index = store.findIndex((w) => w.id === workout.id)
		if (index === -1) {
			throw new Error("Workout not found with ID: " + workout.id)
		}
		store[index] = { ...workout }
		return store[index]
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
