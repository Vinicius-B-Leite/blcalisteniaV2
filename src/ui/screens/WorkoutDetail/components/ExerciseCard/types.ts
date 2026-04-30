import { MuscleGroup } from "@/constants"

export namespace ExerciseCard {
	export type Props = {
		id: string
		title: string
		muscleGroup: MuscleGroup[]
		imageUrl?: string | null
		onPress?: () => void
		onEditPress?: () => void
		onDeletePress?: () => void
	}
}
