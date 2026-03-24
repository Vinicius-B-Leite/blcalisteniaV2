import { IWorkoutRepo } from "@/domains/Workout"
import { select } from "@/utils"

const WorkoutRepo = select.env<IWorkoutRepo>({
	test: () => require("./inMemory/InMemoryWorkoutRepo").InMemoryWorkoutRepo,
	default: () => require("./watermelon/WatermelonWorkoutRepo").WatermelonWorkoutRepo,
})

export { WorkoutRepo }
