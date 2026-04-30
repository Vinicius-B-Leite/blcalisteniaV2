import { useAppQuery } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { ExerciseWithWorkoutSetsModel } from "../WorkoutExerciseModel"

export const useGetExercisesWithSetsByWorkout = (workoutId: string) => {
	const workoutExerciseRepo = useWorkoutExerciseRepo()

	const { data, isLoading } = useAppQuery<ExerciseWithWorkoutSetsModel[]>({
		queryKey: [workoutExerciseQueryKeys.byWorkoutIdWithSets, { workoutId }],
		queryFn: () => workoutExerciseRepo.getExercisesWithSetsByWorkout(workoutId),
		onError: (err) => {
			console.error("Error fetching workout exercises with sets:", err)
		},
	})

	return { exercisesWithSets: data ?? [], isLoading }
}
