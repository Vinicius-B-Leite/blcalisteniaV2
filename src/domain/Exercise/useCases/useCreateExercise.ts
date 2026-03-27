import { useAppMutation } from "@/hooks"
import { useExerciseRepo, exerciseQueryKeys } from "@/repos/Exercise"
import { ExerciseModel } from "../ExerciseModel"

import { useQueryCache } from "@/infra/services"

export const useCreateExercise = () => {
	const exerciseRepo = useExerciseRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<
		ExerciseModel,
		Omit<ExerciseModel, "id">
	>({
		mutationFn: (variables) => exerciseRepo.createExercise(variables),
		onSuccess: () => {
			queryCacheService.invalidateCacheSingle([exerciseQueryKeys.all])
		},
		onError: (err) => {
			console.log("Error creating exercise :(", err)
		},
	})

	return { execute, isLoading }
}
