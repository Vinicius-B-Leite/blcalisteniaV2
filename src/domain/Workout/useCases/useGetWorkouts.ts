import { useAppQuery } from "@/hooks"
import { workoutQueryKeys, useWorkoutRepo } from "@/repos/Workout"
import { handleError } from "@/utils"

export const useGetWorkouts = () => {
	const workoutRepo = useWorkoutRepo()

	const { data, isLoading, refetch, isRefetching } = useAppQuery({
		queryKey: [workoutQueryKeys.all],
		queryFn: () => workoutRepo.getAllWorkouts(),
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao buscar os treinos")
		},
	})

	return { workouts: data ?? [], isLoading, refetch, isRefetching }
}
