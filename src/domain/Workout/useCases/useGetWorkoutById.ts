import { useAppQuery } from "@/hooks"
import { workoutQueryKeys, useWorkoutRepo } from "@/repos/Workout"
import { ComumParamsUseCase } from "@/types/comumParamsUseCase"
import { handleError } from "@/utils"

type UseGetWorkoutByIdParams = ComumParamsUseCase & {
	id: string
}

export const useGetWorkoutById = ({ id, onError }: UseGetWorkoutByIdParams) => {
	const workoutRepo = useWorkoutRepo()

	const { data, isLoading, refetch } = useAppQuery({
		queryKey: [workoutQueryKeys.detail, { id }],
		queryFn: () => workoutRepo.getWorkoutById(id),
		enabled: !!id,
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao buscar o treino")
			onError?.(err)
		},
	})

	return { workout: data, isLoading, refetch }
}
