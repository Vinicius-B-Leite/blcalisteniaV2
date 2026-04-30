export type DeleteExerciseModalProps = {
	visible: boolean
	exerciseName: string
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}
