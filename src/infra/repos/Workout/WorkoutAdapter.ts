import { CATEGORIES } from "src/constants"
import { WorkoutModel } from "@/domains/Workout"
import WorkoutsModel from "src/infra/database/watermelon/models/WorkoutsModel"

export const workoutAdapters = {
	toDomain: (data: WorkoutsModel): WorkoutModel => {
		return {
			id: data.id,
			title: data.title,
			category: CATEGORIES[data.category as keyof typeof CATEGORIES],
			imageUrl: data.imageUrl,
			weekDaysFrequency: data.weekDaysFrequency,
			description: data.description,
		}
	},

	toDTO: (data: WorkoutModel): Partial<WorkoutsModel> => ({
		title: data.title,
		category: data.category,
		imageUrl: data.imageUrl,
		weekDaysFrequency: data.weekDaysFrequency,
		description: data.description,
	}),
}
