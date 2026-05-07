import { useAppMutation } from "@/hooks"
import { useWorkoutExerciseRepo, workoutExerciseQueryKeys } from "@/repos/WorkoutExercise"
import { useQueryCache } from "@/infra/services"
import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"
import { WorkoutExerciseModel } from "../WorkoutExerciseModel"
import { handleError } from "@/utils"

type AddWorkoutExerciseParams = {
	exerciseId: string
	workoutId: string
	sets: Omit<WorkoutExerciseSetModel, "id" | "workoutExerciseId">[]
}

export const useAddWorkoutExercise = () => {
	const workoutExerciseRepo = useWorkoutExerciseRepo()
	const queryCacheService = useQueryCache()

	const { execute, isLoading } = useAppMutation<
		WorkoutExerciseModel,
		AddWorkoutExerciseParams
	>({
		mutationFn: ({ exerciseId, workoutId, sets }) =>
			workoutExerciseRepo.addExercise({ exerciseId, workoutId }, sets),
		onSuccess: async (res) => {
			await queryCacheService.invalidateCacheSingle([
				workoutExerciseQueryKeys.byWorkoutId,
				{ workoutId: res.workoutId },
			])
		},
		onError: (err) => {
			handleError(err, "Ocorreu um erro ao adicionar o exercício ao treino")
		},
	})

	return { execute, isLoading }
}
