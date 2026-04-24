import { useAppMutation } from "@/hooks"
import { useExerciseRepo, exerciseQueryKeys } from "@/repos/Exercise"
import { useQueryCache } from "@/infra/services"

export const useDeleteExercise = () => {
	const exerciseRepo = useExerciseRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<void, string>({
		mutationFn: (id) => exerciseRepo.deleteExercise(id),
		onSuccess: () => {
			queryCacheService.invalidateCacheSingle([exerciseQueryKeys.all])
		},
		onError: (err) => {
			console.error(err)
		},
	})

	return { execute, isLoading }
}
