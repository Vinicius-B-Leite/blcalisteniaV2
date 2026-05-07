import { useAppQuery } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { ExerciseModel } from "@/domains/Exercise"
import { handleError } from "@/utils"

export const useGetExercisesByWorkout = (workoutId: string) => {
	const workoutExerciseRepo = useWorkoutExerciseRepo()

	const { data, isLoading } = useAppQuery<ExerciseModel[]>({
		queryKey: [workoutExerciseQueryKeys.byWorkoutId, { workoutId }],
		queryFn: () => workoutExerciseRepo.getExercisesByWorkout(workoutId),
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao buscar os exercícios do treino")
		},
	})

	return { workoutExercises: data ?? [], isLoading }
}
