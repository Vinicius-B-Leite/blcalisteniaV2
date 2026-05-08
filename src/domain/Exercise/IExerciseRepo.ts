import { MuscleGroup } from "@/constants"
import { ExerciseModel } from "./ExerciseModel"

export type GetAllExercisesParams = {
	userId: string
	searchText?: string
	muscleGroup?: MuscleGroup
}

export interface IExerciseRepo {
	getAllExercises(params?: GetAllExercisesParams): Promise<ExerciseModel[]>
	createExercise(params: Omit<ExerciseModel, "id">): Promise<ExerciseModel>
	updateExercise(
		id: string,
		params: Partial<Omit<ExerciseModel, "id">>,
	): Promise<ExerciseModel>
	deleteExercise(id: string): Promise<void>
	getManyByIds(ids: string[]): Promise<ExerciseModel[]>
	getById(id: string): Promise<ExerciseModel | null>
}
