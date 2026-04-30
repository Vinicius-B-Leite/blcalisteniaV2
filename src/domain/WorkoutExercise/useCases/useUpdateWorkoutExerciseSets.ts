import { useAppMutation } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { useQueryCache } from "@/infra/services"
import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"

type UpdateWorkoutExerciseSetsParams = {
	workoutExerciseId: string
	sets: Omit<WorkoutExerciseSetModel, "id" | "workoutExerciseId">[]
}

export const useUpdateWorkoutExerciseSets = () => {
	const workoutExerciseRepo = useWorkoutExerciseRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<void, UpdateWorkoutExerciseSetsParams>({
		mutationFn: ({ workoutExerciseId, sets }) =>
			workoutExerciseRepo.updateExerciseSets(workoutExerciseId, sets),
		onSuccess: async () => {
			await queryCacheService.invalidateCacheSingle([
				workoutExerciseQueryKeys.byWorkoutIdWithSets,
			])
		},
		onError: (err) => {
			console.error("Error updating workout exercise sets:", err)
		},
	})

	return { execute, isLoading }
}
