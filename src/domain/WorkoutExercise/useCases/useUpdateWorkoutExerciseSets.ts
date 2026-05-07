import { useAppMutation } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { useQueryCache } from "@/infra/services"
import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"
import { handleError } from "@/utils"

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
			handleError(
				err,
				"Ocorreu um erro ao atualizar as séries do exercício do treino",
			)
		},
	})

	return { execute, isLoading }
}
