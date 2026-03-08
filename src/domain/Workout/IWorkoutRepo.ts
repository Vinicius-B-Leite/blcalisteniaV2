import { WorkoutModel } from "./WorkoutModel"

export interface IWorkoutRepo {
	getAllWorkouts: () => Promise<WorkoutModel[]>
	getWorkoutById: (id: string) => Promise<WorkoutModel | undefined>
	createWorkout: (params: Omit<WorkoutModel, "id">) => Promise<WorkoutModel>
	deleteWorkout: (id: string) => Promise<void>
	//updateWorkout: (workout: Workout) => Promise<void>
}
