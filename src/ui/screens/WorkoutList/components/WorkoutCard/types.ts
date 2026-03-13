import { Category } from "@/constants"

export type WorkoutCardProps = {
	id: string
	title: string
	exerciseCount: number
	category: Category
	imageUrl?: string
	onRedirect: () => void
	onDelete: () => void
}
