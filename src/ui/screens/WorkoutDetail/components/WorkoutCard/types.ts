export namespace WorkoutCard {
	export type Props = {
		title: string
		subtitle: string
		category: string
		day: string
		imageUrl?: string
		onEditPress?: () => void
	}
}
