import { MuscleGroup } from "@/constants"
import { ExerciseModel } from "@/domains/Exercise"

export namespace ExerciseCard {
	export type Props = {
		id: ExerciseModel["id"]
		name: ExerciseModel["name"]
		musclesGroups: ExerciseModel["musclesGroups"]
		bannerUrl?: ExerciseModel["bannerUrl"]
		isSelected?: boolean
		onAdd?: () => void
		isCustom?: boolean
		onEdit?: () => void
	}
}
