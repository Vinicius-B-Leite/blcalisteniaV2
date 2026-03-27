import { IExerciseRepo } from "@/domains/Exercise"
import { database } from "@/infra/database"
import ExercisesModel from "@/infra/database/watermelon/models/ExercisesModel"
import { exerciseAdapters } from "../../ExerciseAdapter"

export const WatermelonExerciseRepo: IExerciseRepo = {
	getAllExercises: async () => {
		try {
			const exercises = await database.collections
				.get<ExercisesModel>("exercises")
				.query()
				.fetch()

			return exercises.map(exerciseAdapters.toDomain)
		} catch (error) {
			throw new Error("Error fetching exercises: " + error)
		}
	},

	createExercise: async (params) => {
		try {
			let createdExercise: ExercisesModel

			await database.write(async () => {
				createdExercise = await database.collections
					.get<ExercisesModel>("exercises")
					.create((record) => {
						const dto = exerciseAdapters.toDTO(params)
						record.name = dto.name!
						record.musclesGroups = dto.musclesGroups!

						if (dto.bannerUrl) {
							record.bannerUrl = dto.bannerUrl
						}

						if (params.userId) {
							// @ts-ignore - Watermelon doesn't recognize the relation field, but it exists in the model
							record.user.id = params.userId
						}
					})
			})

			return exerciseAdapters.toDomain(createdExercise!)
		} catch (error) {
			throw new Error("Error creating exercise: " + error)
		}
	},
}
