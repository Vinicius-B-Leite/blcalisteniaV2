import { createContext, useContext } from "react"
import { IWorkoutRepo } from "src/domain/Workout/IWorkoutRepo"

const WorkoutRepoContext = createContext({} as IWorkoutRepo)

export const WorkoutRepoProvider = WorkoutRepoContext.Provider

export const useWorkoutRepo = () => {
	const context = useContext(WorkoutRepoContext)
	if (!context) {
		throw new Error("useWorkoutRepo must be used within an WorkoutRepoProvider")
	}
	return context
}
