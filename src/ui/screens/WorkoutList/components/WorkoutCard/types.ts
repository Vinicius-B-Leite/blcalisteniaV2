export type WorkoutCardProps = {
	id: string
	title: string
	exerciseCount: number
	category: string
	imageUrl?: string
	onRedirect: () => void
	onDelete: () => void
}
