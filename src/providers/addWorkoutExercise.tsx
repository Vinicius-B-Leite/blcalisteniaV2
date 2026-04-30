import { ExerciseModel } from "@/domains/Exercise"
import { createContext, useContext, useState } from "react"

type AddWorkoutExerciseContextType = {
	addWorkoutExercise: (params: ExerciseModel) => void
	currentWorkoutExercises: ExerciseModel | null
	resetCurrentWorkoutExercise: () => void
}

const AddWorkoutExerciseContext = createContext({} as AddWorkoutExerciseContextType)
export const AddWorkoutExerciseProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [currentWorkoutExercises, setCurrentWorkoutExercises] =
		useState<ExerciseModel | null>(null)

	const addWorkoutExercise = (exercise: ExerciseModel) => {
		setCurrentWorkoutExercises(exercise)
	}

	const resetCurrentWorkoutExercise = () => {
		setCurrentWorkoutExercises(null)
	}

	return (
		<AddWorkoutExerciseContext.Provider
			value={{
				addWorkoutExercise,
				currentWorkoutExercises,
				resetCurrentWorkoutExercise,
			}}>
			{children}
		</AddWorkoutExerciseContext.Provider>
	)
}

export const useAddWorkoutExerciseContext = () => {
	const context = useContext(AddWorkoutExerciseContext)
	if (!context) {
		throw new Error(
			"useAddWorkoutExercise must be used within an AddWorkoutExerciseProvider",
		)
	}
	return context
}
