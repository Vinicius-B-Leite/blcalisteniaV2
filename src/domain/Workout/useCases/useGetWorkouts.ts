import { useAppInfiniteQuery } from "@/hooks"
import { workoutQueryKeys, useWorkoutRepo } from "@/repos/Workout"
import { WorkoutModel } from "../WorkoutModel"

const WORKOUTS_LIMIT = 20

type UseGetWorkoutsParams = {
	searchText?: string
}

export const useGetWorkouts = ({ searchText }: UseGetWorkoutsParams = {}) => {
	const workoutRepo = useWorkoutRepo()

	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
		isRefetching,
	} = useAppInfiniteQuery<WorkoutModel>({
		queryKey: [workoutQueryKeys.all, { searchText }],
		queryFn: (page) =>
			workoutRepo.getAllWorkouts({ page, limit: WORKOUTS_LIMIT, searchText }),
	})

	const workouts = data?.pages.flatMap((page) => page.items) ?? []

	return {
		workouts,
		isLoading,
		isFetchingNextPage: isFetchingNextPage ?? false,
		hasNextPage: hasNextPage ?? false,
		fetchNextPage,
		refetch,
		isRefetching,
	}
}
