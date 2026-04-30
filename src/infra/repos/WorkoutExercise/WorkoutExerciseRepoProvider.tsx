import { createContext, useContext } from "react"
import { IWorkoutExerciseRepo } from "@/domains/WorkoutExercise"

const WorkoutExerciseRepoContext = createContext({} as IWorkoutExerciseRepo)

export const WorkoutExerciseRepoProvider = WorkoutExerciseRepoContext.Provider

export const useWorkoutExerciseRepo = () => {
	const context = useContext(WorkoutExerciseRepoContext)
	if (!context) {
		throw new Error(
			"useWorkoutExerciseRepo must be used within a WorkoutExerciseRepoProvider",
		)
	}
	return context
}
