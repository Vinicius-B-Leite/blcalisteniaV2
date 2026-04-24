export type DeleteExerciseModalProps = {
	visible: boolean
	exerciseName: string | null
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}
