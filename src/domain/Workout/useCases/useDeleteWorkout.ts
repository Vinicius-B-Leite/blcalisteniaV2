import { useAppMutation } from "@/hooks"
import { useWorkoutRepo, workoutQueryKeys } from "@/repos/Workout"
import { useQueryClient } from "@tanstack/react-query"
import { useImageStorage } from "@/infra/services"

export const useDeleteWorkout = () => {
	const workoutRepo = useWorkoutRepo()

	//TODO: pensar em como extrair o client
	const queryClient = useQueryClient()
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
			console.log("Error deleting workout :(", err)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [workoutQueryKeys.all],
			})
		},
	})

	return { execute, isLoading }
}
