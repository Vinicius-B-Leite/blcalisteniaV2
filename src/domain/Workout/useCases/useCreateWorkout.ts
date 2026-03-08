import { useAppMutation } from "src/hooks"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"
import { WorkoutModel } from "../WorkoutModel"
import { useQueryClient } from "@tanstack/react-query"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"

export const useCreateWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	const queryClient = useQueryClient()

	const { execute, isLoading } = useAppMutation<WorkoutModel, Omit<WorkoutModel, "id">>(
		{
			mutationFn: (variables) => workoutRepo.createWorkout(variables),
			onError: (err) => {
				console.log("Error creating workout :(", err)
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: [workoutQueryKeys.all],
				})
			},
		},
	)

	return { execute, isLoading }
}
