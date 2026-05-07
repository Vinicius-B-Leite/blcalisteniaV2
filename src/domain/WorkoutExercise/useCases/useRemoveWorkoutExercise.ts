import { useAppMutation } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { useQueryCache } from "@/infra/services"
import { handleError } from "@/utils"

export const useRemoveWorkoutExercise = () => {
	const workoutExerciseRepo = useWorkoutExerciseRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<void, string>({
		mutationFn: (workoutExerciseId) =>
			workoutExerciseRepo.removeExercise(workoutExerciseId),
		onSuccess: async () => {
			await queryCacheService.invalidateCacheMultiple([
				[workoutExerciseQueryKeys.byWorkoutId],
				[workoutExerciseQueryKeys.byWorkoutIdWithSets],
			])
		},
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao remover o exercício do treino")
		},
	})

	return { execute, isLoading }
}
