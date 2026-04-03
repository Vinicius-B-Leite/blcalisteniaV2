const prefix = "create-exercise-modal"

export const CREATE_EXERCISE_MODAL_TEST_IDS = {
	MODAL: `${prefix}`,
	NAME_INPUT: `${prefix}-name-input`,
	MUSCLE_GROUP_CHIP: ({ muscleGroup }: { muscleGroup: string }) =>
		`${prefix}-muscle-group-chip-${muscleGroup}`,
	SUBMIT_BUTTON: `${prefix}-submit-button`,
	CANCEL_BUTTON: `${prefix}-cancel-button`,
	LOADING_STATE: `${prefix}-loading-state`,
}
