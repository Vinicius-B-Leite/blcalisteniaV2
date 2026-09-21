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
	SET_PROGRESS_CURRENT: `${prefix}-set-progress-current`, // número da série atual (1-based) — checar .props.children
	GO_BACK_BUTTON: `${prefix}-go-back-button`,
	COMPLETE_SET_BUTTON: `${prefix}-complete-set-button`,
	ADD_REST_SECONDS_BUTTON: `${prefix}-add-rest-seconds-button`,
	SKIP_REST_BUTTON: `${prefix}-skip-rest-button`,
	REST_TIMER_VALUE: `${prefix}-rest-timer-value`, // exibe "MM:SS" — checar .props.children
	EXIT_CONFIRMATION_MODAL: `${prefix}-exit-confirmation-modal`,
	EXIT_CONFIRMATION_CANCEL_BUTTON: `${prefix}-exit-confirmation-cancel-button`,
	EXIT_CONFIRMATION_CONFIRM_BUTTON: `${prefix}-exit-confirmation-confirm-button`,
}
