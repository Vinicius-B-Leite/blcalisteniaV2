const prefix = "workout-session-screen"

export const WORKOUT_SESSION_SCREEN_TEST_IDS = {
	LOADING_STATE: `${prefix}-loading-state`,
	EMPTY_STATE: `${prefix}-empty-state`,
	WORKOUT_TITLE: `${prefix}-workout-title`,
	EXERCISE_NAME: `${prefix}-exercise-name`,
	MUSCLE_GROUP: `${prefix}-muscle-group`,
	EXERCISE_INDICATOR: `${prefix}-exercise-indicator`, // estático, um por pontinho — usar queryAllByTestId para contar
	SET_ITEM: `${prefix}-set-item`, // estático, um por série — usar queryAllByTestId para contar
	SET_ITEM_REPS: `${prefix}-set-item-reps`, // estático, um por série — checar .props.children por índice
}
