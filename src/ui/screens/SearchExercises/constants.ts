const prefix = "search-exercises-screen"

export const SEARCH_EXERCISES_SCREEN_TEST_IDS = {
	LOADING_STATE: `${prefix}-loading-state`,
	EXERCISE_ITEM: `${prefix}-exercise-item`,
	SEARCH_INPUT: `${prefix}-search-input`,
	CATEGORY_CHIP: ({ muscleGroup }: { muscleGroup: string }) =>
		`${prefix}-category-chip-${muscleGroup}`,
	ADD_BUTTON: `${prefix}-add-button`,
	TOGGLE_EXERCISE_BUTTON: ({ id }: { id: string }) =>
		`${prefix}-toggle-exercise-button-${id}`,
	CREATE_EXERCISE_BUTTON: `${prefix}-create-exercise-button`,
	EDIT_EXERCISE_BUTTON: ({ id }: { id: string }) =>
		`${prefix}-edit-exercise-button-${id}`,
	DELETE_EXERCISE_BUTTON: ({ id }: { id: string }) =>
		`${prefix}-delete-exercise-button-${id}`,
	DELETE_EXERCISE_MODAL_CONFIRM: `${prefix}-delete-exercise-modal-confirm`,
	DELETE_EXERCISE_MODAL_CANCEL: `${prefix}-delete-exercise-modal-cancel`,
}
