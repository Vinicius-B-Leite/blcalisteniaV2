import { useAppMutation } from "@/hooks"
import { useWorkoutRepo, workoutQueryKeys } from "@/repos/Workout"
import { WorkoutModel } from "../WorkoutModel"
//TODO: pensar em extrair client
import { useQueryClient } from "@tanstack/react-query"
import { useImageStorage } from "@/infra/services"

export const useUpdateWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	const queryClient = useQueryClient()
	const imageStorage = useImageStorage()

	const { execute, isLoading } = useAppMutation<WorkoutModel, WorkoutModel>({
		mutationFn: async (workout) => {
			const oldWorkout = await workoutRepo.getWorkoutById(workout.id)

			const updatedWorkout = await workoutRepo.updateWorkout(workout)

			if (oldWorkout?.imageUrl) {
				const isSameImage = oldWorkout.imageUrl === workout.imageUrl
				const isOldImageAppDirectory = imageStorage.isAppDirectoryImage(
					oldWorkout.imageUrl,
				)

				if (!isSameImage && isOldImageAppDirectory) {
					await imageStorage.deleteImage(oldWorkout.imageUrl)
				}
			}

			return updatedWorkout
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
