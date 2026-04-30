import { createContext, useContext } from "react"
import { IWorkoutExerciseSetRepo } from "@/domains/WorkoutExerciseSet"

const WorkoutExerciseSetRepoContext = createContext({} as IWorkoutExerciseSetRepo)

export const WorkoutExerciseSetRepoProvider = WorkoutExerciseSetRepoContext.Provider

export const useWorkoutExerciseSetRepo = () => {
	const context = useContext(WorkoutExerciseSetRepoContext)
	if (!context) {
		throw new Error(
			"useWorkoutExerciseSetRepo must be used within a WorkoutExerciseSetRepoProvider",
		)
	}
	return context
}
