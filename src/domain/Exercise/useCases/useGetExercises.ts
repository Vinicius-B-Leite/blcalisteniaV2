import { useAppQuery } from "@/hooks"
import { exerciseQueryKeys, useExerciseRepo } from "@/repos/Exercise"
import { ExerciseModel } from "../ExerciseModel"
import { useAuth } from "@/domains/Auth"
import { handleError } from "@/utils"
import { MuscleGroup } from "@/constants"

type UseGetExercisesParams = {
	searchText?: string
	muscleGroup?: MuscleGroup
}

export const useGetExercises = ({
	searchText,
	muscleGroup,
}: UseGetExercisesParams = {}) => {
	const exerciseRepo = useExerciseRepo()
	const { auth } = useAuth()

	const { data, isLoading } = useAppQuery<ExerciseModel[]>({
		queryKey: [exerciseQueryKeys.all, { userId: auth?.id, searchText, muscleGroup }],
		queryFn: () =>
			exerciseRepo.getAllExercises({
				userId: auth?.id ?? "",
				searchText,
				muscleGroup,
			}),
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao buscar os exercícios")
		},
	})

	const exercises = data ?? []

	return { exercises, isLoading }
}
