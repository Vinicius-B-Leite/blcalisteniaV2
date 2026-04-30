import { IWorkoutExerciseSetRepo } from "@/domains/WorkoutExerciseSet"
import { select } from "@/utils"

const WorkoutExerciseSetRepo = select.env<IWorkoutExerciseSetRepo>({
	test: () =>
		require("./inMemory/InMemoryWorkoutExerciseSetRepo")
			.InMemoryWorkoutExerciseSetRepo,
	default: () =>
		require("./watermelon/WatermelonWorkoutExerciseSetRepo")
			.WatermelonWorkoutExerciseSetRepo,
})

export { WorkoutExerciseSetRepo }
