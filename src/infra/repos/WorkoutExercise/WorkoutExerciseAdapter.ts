import { WorkoutExerciseModel, WorkoutExerciseWithSets } from "@/domains/WorkoutExercise"
import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"
import WorkoutExercisesModel from "@/infra/database/watermelon/models/WorkoutExercisesModel"
import WorkoutExerciseSetsModel from "@/infra/database/watermelon/models/WorkoutExerciseSetsModel"

export const workoutExerciseAdapters = {
	toDomainWithSets: (
		data: WorkoutExercisesModel,
		sets: WorkoutExerciseSetsModel[],
	): WorkoutExerciseWithSets => ({
		id: data.id,
		workoutId: data.workout.id,
		exerciseId: data.exercise.id,
		sets: sets.map(workoutExerciseSetAdapters.toDomain),
	}),

	toDomain: (data: WorkoutExercisesModel): WorkoutExerciseModel => ({
		id: data.id,
		workoutId: data.workout.id,
		exerciseId: data.exercise.id,
	}),
}

export const workoutExerciseSetAdapters = {
	toDomain: (data: WorkoutExerciseSetsModel): WorkoutExerciseSetModel => ({
		id: data.id,
		workoutExerciseId: data.workoutExercise.id,
		reps: data.reps,
		rest: data.rest,
	}),
}
