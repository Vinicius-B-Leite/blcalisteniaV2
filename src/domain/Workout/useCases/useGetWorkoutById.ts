import { useAppQuery } from "src/hooks"
import { workoutQueryKeys } from "src/infra/repos/Workout/WorkoutQueryKeys"
import { useWorkoutRepo } from "src/infra/repos/Workout/WorkoutRepoProvider"

type UseGetWorkoutByIdParams = {
	id: string
	onError?: () => void
}

export const useGetWorkoutById = ({ id, onError }: UseGetWorkoutByIdParams) => {
	const workoutRepo = useWorkoutRepo()

	const { data, isLoading, refetch } = useAppQuery({
		queryKey: [workoutQueryKeys.detail, { id }],
		queryFn: () => workoutRepo.getWorkoutById(id),
		enabled: !!id,
		onError,
	})

	return { workout: data, isLoading, refetch }
}
