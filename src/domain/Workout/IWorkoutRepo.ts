import { WorkoutModel } from "./WorkoutModel"

export interface IWorkoutRepo {
	getAllWorkouts: () => Promise<WorkoutModel[]>
	//getWorkoutById: (id: string) => Promise<Workout | null>
	//createWorkout: (workout: Workout) => Promise<void>
	//updateWorkout: (workout: Workout) => Promise<void>
	//deleteWorkout: (id: string) => Promise<void>
}
