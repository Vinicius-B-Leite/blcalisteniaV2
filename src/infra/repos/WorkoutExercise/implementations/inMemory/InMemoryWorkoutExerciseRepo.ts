import {
	IWorkoutExerciseRepo,
	WorkoutExerciseModel,
	WorkoutExerciseWithSets,
	ExerciseWithWorkoutSetsModel,
} from "@/domains/WorkoutExercise"
import { ExerciseModel } from "@/domains/Exercise"
import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"
import { ITestableRepository } from "@/tests"

const store: WorkoutExerciseWithSets[] = []
let idCounter = 1
let setIdCounter = 1

export const InMemoryWorkoutExerciseRepo: IWorkoutExerciseRepo & ITestableRepository = {
	addExercise: async (params, sets) => {
		const id = String(idCounter++)
		const createdSets: WorkoutExerciseSetModel[] = sets.map((set) => ({
			...set,
			id: String(setIdCounter++),
			workoutExerciseId: id,
		}))
		const newEntry: WorkoutExerciseWithSets = { ...params, id, sets: createdSets }
		store.push(newEntry)
		return newEntry
	},

	getExercisesByWorkout: async (workoutId) => {
		return store.filter(
			(e) => e.workoutId === workoutId,
		) as unknown as ExerciseModel[]
	},

	getExercisesWithSetsByWorkout: async (workoutId) => {
		const entries = store.filter((e) => e.workoutId === workoutId)
		return entries.map((entry) => ({
			...(entry as unknown as ExerciseWithWorkoutSetsModel),
			workoutExerciseId: entry.id,
		}))
	},

	updateExerciseSets: async (workoutExerciseId, newSets) => {
		const index = store.findIndex((e) => e.id === workoutExerciseId)
		if (index !== -1) {
			const updatedSets: WorkoutExerciseSetModel[] = newSets.map((set) => ({
				...set,
				id: String(setIdCounter++),
				workoutExerciseId,
			}))
			store[index] = { ...store[index], sets: updatedSets }
		}
	},

	removeExercise: async (workoutExerciseId) => {
		const index = store.findIndex((e) => e.id === workoutExerciseId)
		if (index !== -1) {
			store.splice(index, 1)
		}
	},

	seed: async (data) => {
		for (const entry of data) {
			store.push({
				...entry,
				id: entry.id || String(idCounter++),
				sets: (entry as WorkoutExerciseWithSets).sets ?? [],
			})
		}
	},

	clear: async () => {
		store.length = 0
		idCounter = 1
		setIdCounter = 1
	},
}
