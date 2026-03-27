import { createContext, useContext } from "react"
import { IExerciseRepo } from "@/domains/Exercise"

const ExerciseRepoContext = createContext({} as IExerciseRepo)

export const ExerciseRepoProvider = ExerciseRepoContext.Provider

export const useExerciseRepo = () => {
	const context = useContext(ExerciseRepoContext)
	if (!context) {
		throw new Error("useExerciseRepo must be used within an ExerciseRepoProvider")
	}
	return context
}
