import { IWorkoutExerciseRepo } from "@/domains/WorkoutExercise"
import { select } from "@/utils"

const WorkoutExerciseRepo = select.env<IWorkoutExerciseRepo>({
	test: () =>
		require("./inMemory/InMemoryWorkoutExerciseRepo").InMemoryWorkoutExerciseRepo,
	default: () =>
		require("./watermelon/WatermelonWorkoutExerciseRepo")
			.WatermelonWorkoutExerciseRepo,
})

export { WorkoutExerciseRepo }
