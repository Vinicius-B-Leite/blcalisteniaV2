import { useAppQuery } from "src/hooks"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"

export const useGetWorkouts = () => {
	const workoutRepo = useWorkoutRepo()

	const { data, isLoading } = useAppQuery({
		queryKey: [workoutQueryKeys.all],
		queryFn: () => workoutRepo.getAllWorkouts(),
	})

	return { workouts: data ?? [], isLoading }
}
