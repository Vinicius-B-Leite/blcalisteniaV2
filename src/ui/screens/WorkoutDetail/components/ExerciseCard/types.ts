export namespace ExerciseCard {
	export type Props = {
		title: string
		muscleGroup: string
		imageUrl?: string
		onPress?: () => void
		onEditPress?: () => void
		onDeletePress?: () => void
	}
}
