import { useAppMutation } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { useQueryCache } from "@/infra/services"

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
			console.error("Error removing workout exercise:", err)
		},
	})

	return { execute, isLoading }
}
