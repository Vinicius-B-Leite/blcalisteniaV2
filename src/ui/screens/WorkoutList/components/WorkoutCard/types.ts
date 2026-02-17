export type WorkoutCardProps = {
	id: string
	title: string
	exerciseCount: number
	category: string
	imageUrl?: string
	onEdit: () => void
	onDelete: () => void
}
