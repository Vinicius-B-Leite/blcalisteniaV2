import { useAppQuery } from "@/hooks"
import { exerciseQueryKeys, useExerciseRepo } from "@/repos/Exercise"
import { ExerciseModel } from "../ExerciseModel"
import { useMemo } from "react"
import { useAuth } from "@/domains/Auth"

export const useGetExercises = () => {
	const exerciseRepo = useExerciseRepo()
	const { auth } = useAuth()

	const { data, isLoading } = useAppQuery<ExerciseModel[]>({
		queryKey: [exerciseQueryKeys.all],
		queryFn: () => exerciseRepo.getAllExercises(),
		onError: (err) => {
			console.log("Error fetching exercises :(", err)
		},
	})

	const defaultExercises = useMemo(() => {
		return data?.filter((exercise) => exercise.userId === null) || []
	}, [data])

	const userExercises = useMemo(() => {
		if (!auth?.id) return []
		return data?.filter((exercise) => exercise.userId === auth?.id) || []
	}, [data, auth?.id])

	return { userExercises, defaultExercises, isLoading }
}
