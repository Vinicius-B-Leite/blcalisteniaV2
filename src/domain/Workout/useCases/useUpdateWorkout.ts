import { useAppMutation } from "@/hooks"
import { useWorkoutRepo, workoutQueryKeys } from "@/repos/Workout"
import { WorkoutModel } from "../WorkoutModel"
import { useImageStorage, useQueryCache } from "@/infra/services"

export const useUpdateWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	const queryCacheService = useQueryCache()
	const imageStorage = useImageStorage()

	const saveNewImage = async (
		oldWorkout: WorkoutModel,
		updatedWorkout: WorkoutModel,
	) => {
		const isSameImage = oldWorkout.imageUrl === updatedWorkout.imageUrl
		const isLocalImage = imageStorage.isLocalImage(updatedWorkout.imageUrl)
		if (!isSameImage && !isLocalImage) {
			return await imageStorage.saveImageToAppDirectory(
				updatedWorkout.imageUrl,
				updatedWorkout.id,
			)
		}
	}

	const deleteOldImage = async (oldWorkout: WorkoutModel) => {
		if (!oldWorkout.imageUrl) return

		const isAppDirectoryImage = imageStorage.isAppDirectoryImage(oldWorkout.imageUrl)
		if (isAppDirectoryImage) {
			await imageStorage.deleteImage(oldWorkout.imageUrl)
		}
	}

	const { execute, isLoading } = useAppMutation<WorkoutModel, WorkoutModel>({
		mutationFn: async (workout) => {
			const oldWorkout = await workoutRepo.getWorkoutById(workout.id)

			if (!oldWorkout) {
				throw new Error("Workout não encontrado")
			}

			let updatedWorkoutParams = { ...workout }

			const appDirectoryUri = (await saveNewImage(oldWorkout, workout))?.uri
			if (appDirectoryUri) {
				updatedWorkoutParams = {
					...workout,
					imageUrl: appDirectoryUri,
				}
			}

			const updatedWorkout = await workoutRepo.updateWorkout(updatedWorkoutParams)

			if (oldWorkout?.imageUrl) {
				await deleteOldImage(oldWorkout)
			}

			return updatedWorkout
		},
		onError: (err) => {
			console.log("Error updating workout :(", err)
		},
		onSuccess: async (updatedWorkout) => {
			await queryCacheService.invalidateCacheMultiple([
				[workoutQueryKeys.detail, { id: updatedWorkout.id }],
				[workoutQueryKeys.all],
			])
		},
	})

	return { execute, isLoading }
}
