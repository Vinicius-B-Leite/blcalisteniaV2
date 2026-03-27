import { ExerciseModel } from "./ExerciseModel"

export interface IExerciseRepo {
	getAllExercises(): Promise<ExerciseModel[]>
	createExercise(params: Omit<ExerciseModel, "id">): Promise<ExerciseModel>
}
