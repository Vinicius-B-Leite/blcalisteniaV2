import { useAppMutation } from "@/hooks"
import { useExerciseRepo, exerciseQueryKeys } from "@/repos/Exercise"
import { ExerciseModel } from "../ExerciseModel"

import { useQueryCache } from "@/infra/services"
import { handleError } from "@/utils"

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
			handleError(err, "Ocorreu um erro ao criar o exercício")
		},
	})

	return { execute, isLoading }
}
