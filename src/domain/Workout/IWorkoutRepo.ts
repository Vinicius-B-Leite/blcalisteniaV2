import { PaginatedResult } from "@/types/pagination"
import { WorkoutModel } from "./WorkoutModel"

export type GetWorkoutsParams = {
	page: number
	limit: number
	searchText?: string
}

export interface IWorkoutRepo {
	getAllWorkouts: (params: GetWorkoutsParams) => Promise<PaginatedResult<WorkoutModel>>
	getWorkoutById: (id: string) => Promise<WorkoutModel | undefined>
	createWorkout: (params: Omit<WorkoutModel, "id">) => Promise<WorkoutModel>
	deleteWorkout: (id: string) => Promise<void>
	updateWorkout: (workout: WorkoutModel) => Promise<WorkoutModel>
}
