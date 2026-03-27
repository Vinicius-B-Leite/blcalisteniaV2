import { MuscleGroup } from "@/constants"

export namespace CategoryFilter {
	export type Props = {
		selectedCategory: MuscleGroup | null
		onSelectCategory: (category: MuscleGroup) => void
	}

	export type ChipProps = {
		muscleGroup: MuscleGroup
		isSelected: boolean
		onPress: () => void
	}
}
