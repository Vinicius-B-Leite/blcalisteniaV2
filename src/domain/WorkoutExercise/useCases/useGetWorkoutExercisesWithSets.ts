import { useAppQuery } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { ExerciseWithWorkoutSetsModel } from "../WorkoutExerciseModel"
import { handleError } from "@/utils"

export const useGetExercisesWithSetsByWorkout = (workoutId: string) => {
	const workoutExerciseRepo = useWorkoutExerciseRepo()

	const { data, isLoading } = useAppQuery<ExerciseWithWorkoutSetsModel[]>({
		queryKey: [workoutExerciseQueryKeys.byWorkoutIdWithSets, { workoutId }],
		queryFn: () => workoutExerciseRepo.getExercisesWithSetsByWorkout(workoutId),
		onError: (err) => {
			handleError(
				err,
				"Ocorreu um erro ao buscar os exercícios com séries do treino",
			)
		},
	})

	return { exercisesWithSets: data ?? [], isLoading }
}
