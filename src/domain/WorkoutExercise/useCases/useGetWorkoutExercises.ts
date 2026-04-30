import { useAppQuery } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { ExerciseModel } from "@/domains/Exercise"

export const useGetExercisesByWorkout = (workoutId: string) => {
	const workoutExerciseRepo = useWorkoutExerciseRepo()

	const { data, isLoading } = useAppQuery<ExerciseModel[]>({
		queryKey: [workoutExerciseQueryKeys.byWorkoutId, { workoutId }],
		queryFn: () => workoutExerciseRepo.getExercisesByWorkout(workoutId),
		onError: (err) => {
			console.error("Error fetching workout exercises:", err)
		},
	})

	return { workoutExercises: data ?? [], isLoading }
}
