import { WorkoutExerciseSetModel } from "./WorkoutExerciseSetModel"

export interface IWorkoutExerciseSetRepo {
	getById(id: string): Promise<WorkoutExerciseSetModel>
	addSet(params: Omit<WorkoutExerciseSetModel, "id">): Promise<WorkoutExerciseSetModel>
}
