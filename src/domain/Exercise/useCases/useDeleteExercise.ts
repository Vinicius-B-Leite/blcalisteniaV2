import { useAppMutation } from "@/hooks"
import { useExerciseRepo, exerciseQueryKeys } from "@/repos/Exercise"
import { useQueryCache } from "@/infra/services"
import { handleError } from "@/utils"

export const useDeleteExercise = () => {
	const exerciseRepo = useExerciseRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<void, string>({
		mutationFn: (id) => exerciseRepo.deleteExercise(id),
		onSuccess: () => {
			queryCacheService.resetCacheSingle([exerciseQueryKeys.all])
		},
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao deletar o exercício")
		},
	})

	return { execute, isLoading }
}
