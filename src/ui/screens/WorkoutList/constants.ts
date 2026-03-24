const prefix = "workout-list-screen"
export const WORKOUT_LIST_SCREEN_TEST_IDS = {
	LOADING_STATE: `${prefix}-loading-state`,
	WORKOUT_ITEM: `${prefix}-workout-item`,
	EMPTY_STATE: `${prefix}-empty-state`,
	SEARCH_INPUT: `${prefix}-search-input`,
	NO_SEARCH_RESULTS: `${prefix}-no-search-results`,
	DELETE_BUTTON: ({ id }: { id: string }) => `${prefix}-delete-button-${id}`,
	WORKOUT_LIST: `${prefix}-workout-list`,
	TO_DETAILS_BUTTON: ({ id }: { id: string }) => `${prefix}-to-details-button-${id}`,
}
