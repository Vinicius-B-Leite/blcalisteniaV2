import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"
import {
	WorkoutExerciseModel,
	ExerciseWithWorkoutSetsModel,
} from "./WorkoutExerciseModel"
import { ExerciseModel } from "../Exercise"

export interface IWorkoutExerciseRepo {
	addExercise(
		params: Omit<WorkoutExerciseModel, "id">,
		sets: Omit<WorkoutExerciseSetModel, "id" | "workoutExerciseId">[],
	): Promise<WorkoutExerciseModel>

	getExercisesByWorkout(workoutId: string): Promise<ExerciseModel[]>

	getExercisesWithSetsByWorkout(
		workoutId: string,
	): Promise<ExerciseWithWorkoutSetsModel[]>

	updateExerciseSets(
		workoutExerciseId: string,
		sets: Omit<WorkoutExerciseSetModel, "id" | "workoutExerciseId">[],
	): Promise<void>

	removeExercise(workoutExerciseId: string): Promise<void>
}
