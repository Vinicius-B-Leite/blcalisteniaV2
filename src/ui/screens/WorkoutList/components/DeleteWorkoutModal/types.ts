export type DeleteWorkoutModalProps = {
	visible: boolean
	workoutName: string | null
	onClose: () => void
	onConfirm: () => void
}
