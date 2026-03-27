import { IExerciseRepo } from "@/domains/Exercise"
import { select } from "@/utils"

const ExerciseRepo = select.env<IExerciseRepo>({
	test: () => require("./inMemory/InMemoryExerciseRepo").InMemoryExerciseRepo,
	default: () => require("./watermelon/WatermelonExerciseRepo").WatermelonExerciseRepo,
})

export { ExerciseRepo }
