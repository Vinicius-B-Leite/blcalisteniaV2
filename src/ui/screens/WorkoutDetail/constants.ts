const prefix = "workout-detail-screen"

export const WORKOUT_DETAIL_SCREEN_TEST_IDS = {
	LOADING_STATE: `${prefix}-loading-state`,
	EXERCISE_ITEM: `${prefix}-exercise-item`,
	EMPTY_STATE: `${prefix}-empty-state`,
	ADD_EXERCISE_BUTTON: `${prefix}-add-exercise-button`,
	START_WORKOUT_BUTTON: `${prefix}-start-workout-button`,
	EXERCISE_LIST: `${prefix}-exercise-list`,
	SEARCH_EXERCISES_BUTTON: `${prefix}-search-exercises-button`,
	SERIES_INPUT: `${prefix}-series-input`,
	REPS_INPUT: `${prefix}-reps-input`,
	REST_INPUT: `${prefix}-rest-input`,
	ADD_CONFIRM_BUTTON: `${prefix}-add-confirm-button`,
	ADD_CANCEL_BUTTON: `${prefix}-add-cancel-button`,
	EDIT_EXERCISE_BUTTON: ({ id }: { id: string }) =>
		`${prefix}-edit-exercise-button-${id}`,
	DELETE_EXERCISE_BUTTON: ({ id }: { id: string }) =>
		`${prefix}-delete-exercise-button-${id}`,
	SAVE_CONFIRM_BUTTON: `${prefix}-save-confirm-button`,
	DELETE_EXERCISE_CONFIRM_BUTTON: `${prefix}-delete-exercise-confirm-button`,
	DELETE_EXERCISE_CANCEL_BUTTON: `${prefix}-delete-exercise-cancel-button`,
}
