import { useAppQuery } from "@/hooks"
import { workoutQueryKeys, useWorkoutRepo } from "@/repos/Workout"

export const useGetWorkouts = () => {
	const workoutRepo = useWorkoutRepo()

	const { data, isLoading, refetch, isRefetching } = useAppQuery({
		queryKey: [workoutQueryKeys.all],
		queryFn: () => workoutRepo.getAllWorkouts(),
		onError: (err) => {
			console.log({ err })
		},
	})

	return { workouts: data ?? [], isLoading, refetch, isRefetching }
}
