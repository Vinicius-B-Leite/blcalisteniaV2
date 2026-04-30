import { ExerciseModel } from "./ExerciseModel"

export interface IExerciseRepo {
	getAllExercises(): Promise<ExerciseModel[]>
	createExercise(params: Omit<ExerciseModel, "id">): Promise<ExerciseModel>
	updateExercise(
		id: string,
		params: Partial<Omit<ExerciseModel, "id">>,
	): Promise<ExerciseModel>
	deleteExercise(id: string): Promise<void>
	getManyByIds(ids: string[]): Promise<ExerciseModel[]>
	getById(id: string): Promise<ExerciseModel | null>
}
