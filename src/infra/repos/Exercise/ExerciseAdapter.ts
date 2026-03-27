import { ExerciseModel } from "src/domain/Exercise/ExerciseModel"
import ExercisesModel from "src/infra/database/watermelon/models/ExercisesModel"

export const exerciseAdapters = {
	toDomain: (data: ExercisesModel): ExerciseModel => {
		return {
			id: data.id,
			name: data.name,
			musclesGroups: data.musclesGroups,
			bannerUrl: data.bannerUrl || null,
			userId: data.user?.id || null,
		}
	},

	toDTO: (data: Omit<ExerciseModel, "id">): Partial<ExercisesModel> => ({
		name: data.name,
		musclesGroups: data.musclesGroups,
		bannerUrl: data.bannerUrl,
	}),
}
