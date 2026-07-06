import { WorkoutModel } from "@/domains/Workout"
import { ExerciseModel } from "@/domains/Exercise"
import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"

const workout: WorkoutModel = {
	id: "workout-1",
	title: "Treino de Força",
	category: "strength",
	imageUrl: "",
	description: "Treino para ganho de força",
	weekDaysFrequency: [1, 3],
}

// Denormalized data for InMemory testing.
// Matches the shape the InMemory WorkoutExerciseRepo stores/returns: ExerciseModel
// fields (name, musclesGroups) + workoutId (used to filter) + sets. `getExercisesWithSetsByWorkout`
// derives `workoutExerciseId` from `id`, so `id` doubles as the workout-exercise id.
type SeededExerciseWithSets = ExerciseModel & {
	workoutId: string
	exerciseId: string
	sets: WorkoutExerciseSetModel[]
}

const exercisesWithSets: SeededExerciseWithSets[] = [
	{
		id: "we-1",
		name: "Flexão de braço",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
		workoutId: "workout-1",
		exerciseId: "exercise-1",
		sets: [
			{ id: "set-1", workoutExerciseId: "we-1", reps: 12, rest: 60 },
			{ id: "set-2", workoutExerciseId: "we-1", reps: 8, rest: 60 },
			{ id: "set-3", workoutExerciseId: "we-1", reps: 15, rest: 60 },
		],
	},
	{
		id: "we-2",
		name: "Supino",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
		workoutId: "workout-1",
		exerciseId: "exercise-2",
		sets: [
			{ id: "set-4", workoutExerciseId: "we-2", reps: 10, rest: 90 },
			{ id: "set-5", workoutExerciseId: "we-2", reps: 10, rest: 90 },
		],
	},
	{
		// Exercise with more than 3 sets — exercises the horizontal ScrollView
		// path (setsCount > 3) from the corrected bug in the spec.
		id: "we-3",
		name: "Agachamento",
		musclesGroups: ["legs"],
		bannerUrl: null,
		userId: null,
		workoutId: "workout-1",
		exerciseId: "exercise-3",
		sets: [
			{ id: "set-6", workoutExerciseId: "we-3", reps: 15, rest: 60 },
			{ id: "set-7", workoutExerciseId: "we-3", reps: 15, rest: 60 },
			{ id: "set-8", workoutExerciseId: "we-3", reps: 12, rest: 60 },
			{ id: "set-9", workoutExerciseId: "we-3", reps: 10, rest: 60 },
		],
	},
]

// Focused exercise with multiple muscle groups (chest + triceps → "Peitoral, Tríceps").
const multiMuscleExercise: SeededExerciseWithSets = {
	id: "we-multi",
	name: "Mergulho nas paralelas",
	musclesGroups: ["chest", "triceps"],
	bannerUrl: null,
	userId: null,
	workoutId: "workout-1",
	exerciseId: "exercise-multi",
	sets: [
		{ id: "set-multi-1", workoutExerciseId: "we-multi", reps: 10, rest: 90 },
		{ id: "set-multi-2", workoutExerciseId: "we-multi", reps: 8, rest: 90 },
	],
}

export const workoutSessionMocks = {
	workout,
	exercisesWithSets,
	multiMuscleExercise,
}
