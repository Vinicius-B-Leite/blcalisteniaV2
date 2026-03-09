import { useAppMutation } from "src/hooks"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"
import { useQueryClient } from "@tanstack/react-query"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"
import { useImageService } from "src/infra/imageService/ImageServiceProvider"

export const useDeleteWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	const queryClient = useQueryClient()
	const imageService = useImageService()

	const { execute, isLoading } = useAppMutation<void, string>({
		mutationFn: async (id) => {
			const workout = await workoutRepo.getWorkoutById(id)

			const isLocalImage = workout?.imageUrl
				? imageService.isLocalImageUri(workout.imageUrl)
				: false
			if (workout?.imageUrl && isLocalImage) {
				await imageService.deleteImage(workout.imageUrl)
			}

			await workoutRepo.deleteWorkout(id)
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
