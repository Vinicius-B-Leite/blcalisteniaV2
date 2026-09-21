import { useState } from "react"
import { Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useGetWorkoutById } from "@/domains/Workout"
import { useGetExercisesWithSetsByWorkout } from "@/domains/WorkoutExercise"

export const useWorkoutSession = () => {
	const router = useRouter()
	const { workoutId } = useLocalSearchParams<{ workoutId: string }>()

	const { workout, isLoading: isWorkoutLoading } = useGetWorkoutById({
		id: workoutId,
		onError: () => router.back(),
	})

	const { exercisesWithSets, isLoading: isExercisesLoading } =
		useGetExercisesWithSetsByWorkout(workoutId)

	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
	const [completedSets, setCompletedSets] = useState(0)

	const focusedExercise = exercisesWithSets[currentExerciseIndex]
	const hasExercises = exercisesWithSets.length > 0
	const plannedRestSeconds = focusedExercise?.sets[completedSets]?.rest ?? 0

	const completeSet = () => {
		if (!focusedExercise) return 0

		const completedSet = focusedExercise.sets[completedSets]

		return completedSet?.rest ?? 0
	}

	const advanceAfterRest = () => {
		if (!focusedExercise) return

		const newCompletedSets = completedSets + 1
		setCompletedSets(newCompletedSets)

		const finishedExercise = newCompletedSets >= focusedExercise.sets.length
		if (!finishedExercise) return

		const isLastExercise = currentExerciseIndex >= exercisesWithSets.length - 1
		if (isLastExercise) {
			Alert.alert("Treino finalizado!")
			return
		}

		setCurrentExerciseIndex((prev) => prev + 1)
		setCompletedSets(0)
	}

	return {
		state: {
			workout,
			focusedExercise,
			exerciseCount: exercisesWithSets.length,
			hasExercises,
			isLoading: isWorkoutLoading || isExercisesLoading,
			completedSets,
			currentExerciseIndex,
			plannedRestSeconds,
		},
		actions: {
			completeSet,
			advanceAfterRest,
		},
	}
}
