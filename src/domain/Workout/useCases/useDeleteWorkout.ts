import { useAppMutation } from "@/hooks"
import { useWorkoutRepo, workoutQueryKeys } from "@/repos/Workout"
import { useImageStorage, useQueryCache } from "@/infra/services"
import { handleError } from "@/utils"
import { ComumParamsUseCase } from "@/types/comumParamsUseCase"

export const useDeleteWorkout = ({ onError }: ComumParamsUseCase) => {
	const workoutRepo = useWorkoutRepo()
	const queryCacheService = useQueryCache()
	const imageStorage = useImageStorage()

	const { execute, isLoading } = useAppMutation<void, string>({
		mutationFn: async (id) => {
			const workout = await workoutRepo.getWorkoutById(id)

			await workoutRepo.deleteWorkout(id)

			const isAppDirectoryImage = imageStorage.isAppDirectoryImage(
				String(workout?.imageUrl),
			)
			if (workout?.imageUrl && isAppDirectoryImage) {
				await imageStorage.deleteImage(workout.imageUrl)
			}
		},
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao deletar o treino")
			onError?.(err)
		},
		onSuccess: async () => {
			await queryCacheService.invalidateCacheSingle([workoutQueryKeys.all])
		},
	})

	return { execute, isLoading }
}
