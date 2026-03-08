import { useAppMutation } from "src/hooks"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"
import { WorkoutModel } from "../WorkoutModel"
import { useQueryClient } from "@tanstack/react-query"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"

export const useUpdateWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	const queryClient = useQueryClient()

	const { execute, isLoading, variables } = useAppMutation<WorkoutModel, WorkoutModel>({
		mutationFn: (workout) => workoutRepo.updateWorkout(workout),
		onError: (err) => {
			console.log("Error updating workout :(", err)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: [workoutQueryKeys.detail, { id: variables?.id }],
			})
			await queryClient.invalidateQueries({
				queryKey: [workoutQueryKeys.all],
			})
		},
	})

	return { execute, isLoading }
}
