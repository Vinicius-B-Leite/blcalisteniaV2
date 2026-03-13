import { useAppMutation } from "@/hooks"
import { useWorkoutRepo } from "@/repos/Workout"
import { WorkoutModel } from "../WorkoutModel"
import { useQueryClient } from "@tanstack/react-query"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"

export const useCreateWorkout = () => {
	const workoutRepo = useWorkoutRepo()
	//TODO: pensar como extrair isso pra um hook de repositorio, ou algo do tipo, pra não precisar ficar importando o useQueryClient (dep externa)
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
