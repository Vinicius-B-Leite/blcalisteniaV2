import { useAppMutation } from "src/hooks"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"
import { useQueryClient } from "@tanstack/react-query"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"

export const useDeleteWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	const queryClient = useQueryClient()

	const { execute, isLoading } = useAppMutation<void, string>({
		mutationFn: (id) => workoutRepo.deleteWorkout(id),
		onError: (err) => {
			console.log("Error deleting workout :(", err)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [workoutQueryKeys.all],
			})
		},
	})

	return { execute, isLoading }
}
