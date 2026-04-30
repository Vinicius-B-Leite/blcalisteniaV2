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
// Includes ExerciseModel fields so getExercisesByWorkout returns renderable exercise data.
const exercises: (ExerciseModel & {
	workoutId: string
	exerciseId: string
	sets: []
})[] = [
	{
		id: "exercise-1",
		name: "Flexão de braço",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
		workoutId: "workout-1",
		exerciseId: "exercise-1",
		sets: [],
	},
	{
		id: "exercise-2",
		name: "Supino",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
		workoutId: "workout-1",
		exerciseId: "exercise-2",
		sets: [],
	},
]

const exercisesWithSets: (ExerciseModel & {
	workoutId: string
	exerciseId: string
	sets: WorkoutExerciseSetModel[]
})[] = [
	{
		id: "we-1",
		name: "Flexão de braço",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
		workoutId: "workout-1",
		exerciseId: "exercise-1",
		sets: [{ id: "set-1", workoutExerciseId: "we-1", reps: 10, rest: 60 }],
	},
	{
		id: "we-2",
		name: "Supino",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
		workoutId: "workout-1",
		exerciseId: "exercise-2",
		sets: [{ id: "set-2", workoutExerciseId: "we-2", reps: 8, rest: 90 }],
	},
]

export const workoutDetailMocks = {
	workout,
	exercises,
	exercisesWithSets,
}
