import { WorkoutModel } from "./WorkoutModel"

export interface IWorkoutRepo {
	getAllWorkouts: () => Promise<WorkoutModel[]>
	createWorkout: (params: Omit<WorkoutModel, "id">) => Promise<WorkoutModel>
	//getWorkoutById: (id: string) => Promise<Workout | null>
	//updateWorkout: (workout: Workout) => Promise<void>
	//deleteWorkout: (id: string) => Promise<void>
}
