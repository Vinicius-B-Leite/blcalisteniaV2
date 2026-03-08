import { useAppQuery } from "src/hooks"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"

export const useGetWorkouts = () => {
	const workoutRepo = useWorkoutRepo()

	const { data, isLoading, refetch, isRefetching } = useAppQuery({
		queryKey: [workoutQueryKeys.all],
		queryFn: () => workoutRepo.getAllWorkouts(),
	})

	return { workouts: data ?? [], isLoading, refetch, isRefetching }
}
