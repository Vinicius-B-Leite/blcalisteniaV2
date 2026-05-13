import { MuscleGroup } from "@/constants"
import { ExerciseModel } from "./ExerciseModel"
import { PaginatedResult } from "@/types/pagination"

export type GetAllExercisesParams = {
	page: number
	limit: number
	userId: string
	searchText?: string
	onlyCustom?: boolean
	muscleGroup?: MuscleGroup
}

export interface IExerciseRepo {
	getAllExercises(
		params: GetAllExercisesParams,
	): Promise<PaginatedResult<ExerciseModel>>
	createExercise(params: Omit<ExerciseModel, "id">): Promise<ExerciseModel>
	updateExercise(
		id: string,
		params: Partial<Omit<ExerciseModel, "id">>,
	): Promise<ExerciseModel>
	deleteExercise(id: string): Promise<void>
	getManyByIds(ids: string[]): Promise<ExerciseModel[]>
	getById(id: string): Promise<ExerciseModel | null>
}
