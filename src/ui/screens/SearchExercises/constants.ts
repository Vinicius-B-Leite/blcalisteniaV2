const prefix = "search-exercises-screen"

export const SEARCH_EXERCISES_SCREEN_TEST_IDS = {
	LOADING_STATE: `${prefix}-loading-state`,
	EXERCISE_ITEM: `${prefix}-exercise-item`,
	CUSTOM_EXERCISE_ITEM: `${prefix}-custom-exercise-item`,
	CUSTOM_EXERCISES_SECTION: `${prefix}-custom-exercises-section`,
	SEARCH_INPUT: `${prefix}-search-input`,
	CATEGORY_CHIP: ({ muscleGroup }: { muscleGroup: string }) =>
		`${prefix}-category-chip-${muscleGroup}`,
	ADD_BUTTON: `${prefix}-add-button`,
	TOGGLE_EXERCISE_BUTTON: ({ id }: { id: string }) =>
		`${prefix}-toggle-exercise-button-${id}`,
}
