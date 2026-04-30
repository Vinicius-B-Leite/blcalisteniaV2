import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"
import { ExerciseModel } from "../Exercise"

export type WorkoutExerciseModel = {
	id: string
	workoutId: string
	exerciseId: string
}

export type WorkoutExerciseWithSets = WorkoutExerciseModel & {
	sets: WorkoutExerciseSetModel[]
}

export type ExerciseWithWorkoutSetsModel = ExerciseModel & {
	workoutExerciseId: string
	sets: WorkoutExerciseSetModel[]
}
