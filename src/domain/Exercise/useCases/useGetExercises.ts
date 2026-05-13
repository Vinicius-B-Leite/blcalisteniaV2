import { useAppInfiniteQuery } from "@/hooks"
import { exerciseQueryKeys, useExerciseRepo } from "@/repos/Exercise"
import { ExerciseModel } from "../ExerciseModel"
import { useAuth } from "@/domains/Auth"
import { MuscleGroup } from "@/constants"

type UseGetExercisesParams = {
	searchText?: string
	onlyCustom?: boolean
	muscleGroup?: MuscleGroup
}

export const useGetExercises = ({
	searchText,
	onlyCustom = false,
	muscleGroup,
}: UseGetExercisesParams = {}) => {
	const exerciseRepo = useExerciseRepo()
	const { auth } = useAuth()

	const query = useAppInfiniteQuery<ExerciseModel>({
		queryKey: [
			exerciseQueryKeys.all,
			{ userId: auth?.id, searchText, onlyCustom, muscleGroup },
		],
		queryFn: (page) =>
			exerciseRepo.getAllExercises({
				page,
				limit: 20,
				userId: auth?.id ?? "",
				searchText,
				onlyCustom,
				muscleGroup,
			}),
	})

	const exercises = query.data?.pages.flatMap((p) => p.items) ?? []

	return {
		exercises,
		isLoading: query.isLoading,
		isFetchingNextPage: query.isFetchingNextPage,
		fetchNextPage: query.fetchNextPage,
		hasNextPage: query.hasNextPage ?? false,
	}
}
