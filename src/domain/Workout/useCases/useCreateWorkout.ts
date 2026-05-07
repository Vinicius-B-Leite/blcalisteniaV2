import { useAppMutation } from "@/hooks"
import { useWorkoutRepo, workoutQueryKeys } from "@/repos/Workout"
import { WorkoutModel } from "../WorkoutModel"
import { useQueryCache } from "@/infra/services"
import { handleError } from "@/utils"

export const useCreateWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<WorkoutModel, Omit<WorkoutModel, "id">>(
		{
			mutationFn: (variables) => workoutRepo.createWorkout(variables),
			onError: (err) => {
				handleError(err, "Ocorreu um erro ao criar o treino")
			},
			onSuccess: async () => {
				await queryCacheService.invalidateCacheSingle([workoutQueryKeys.all])
			},
		},
	)

	return { execute, isLoading }
}
