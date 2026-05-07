import { useAppMutation } from "@/hooks"
import { useExerciseRepo, exerciseQueryKeys } from "@/repos/Exercise"
import { ExerciseModel } from "../ExerciseModel"

import { useQueryCache } from "@/infra/services"
import { handleError } from "@/utils"

type UpdateExerciseParams = {
	id: string
} & Partial<Omit<ExerciseModel, "id">>

export const useUpdateExercise = () => {
	const exerciseRepo = useExerciseRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<ExerciseModel, UpdateExerciseParams>({
		mutationFn: (variables) =>
			exerciseRepo.updateExercise(variables.id, {
				name: variables.name,
				musclesGroups: variables.musclesGroups,
				bannerUrl: variables.bannerUrl,
				userId: variables.userId,
			}),
		onSuccess: () => {
			queryCacheService.invalidateCacheSingle([exerciseQueryKeys.all])
		},
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao atualizar o exercício")
		},
	})

	return { execute, isLoading }
}
