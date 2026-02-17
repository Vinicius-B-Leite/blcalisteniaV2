export namespace ExerciseCard {
	export type Props = {
		title: string
		category: string
		imageUrl?: string
		showImage?: boolean
		onAdd?: () => void
	}
}
