import { useAppMutation } from "src/hooks"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"
import { WorkoutModel } from "../WorkoutModel"
import { useQueryClient } from "@tanstack/react-query"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"
import { useImageService } from "src/infra/imageService/ImageServiceProvider"

export const useUpdateWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	const queryClient = useQueryClient()
	const imageService = useImageService()

	const { execute, isLoading } = useAppMutation<WorkoutModel, WorkoutModel>({
		mutationFn: async (workout) => {
			const oldWorkout = await workoutRepo.getWorkoutById(workout.id)

			if (oldWorkout?.imageUrl) {
				const isSameImage = oldWorkout.imageUrl === workout.imageUrl
				const isOldImageLocal = imageService.isLocalImageUri(oldWorkout.imageUrl)

				if (!isSameImage && isOldImageLocal) {
					await imageService.deleteImage(oldWorkout.imageUrl)
				}
			}

			return workoutRepo.updateWorkout(workout)
		},
		onError: (err) => {
			console.log("Error updating workout :(", err)
		},
		onSuccess: async (updatedWorkout) => {
			await queryClient.invalidateQueries({
				queryKey: [workoutQueryKeys.detail, { id: updatedWorkout.id }],
			})
			await queryClient.invalidateQueries({
				queryKey: [workoutQueryKeys.all],
			})
		},
	})

	return { execute, isLoading }
}
