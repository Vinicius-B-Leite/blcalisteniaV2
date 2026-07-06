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

	const focusedExercise = exercisesWithSets[0]
	const hasExercises = exercisesWithSets.length > 0

	return {
		state: {
			workout,
			focusedExercise,
			exerciseCount: exercisesWithSets.length,
			hasExercises,
			isLoading: isWorkoutLoading || isExercisesLoading,
		},
	}
}
