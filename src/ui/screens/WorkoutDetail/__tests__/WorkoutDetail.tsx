import { act, asTestableRepository, fireEvent, render, screen, waitFor } from "@/tests"
import { WorkoutDetail } from "../WorkoutDetail"
import { WORKOUT_DETAIL_SCREEN_TEST_IDS } from "../constants"
import { WorkoutRepo } from "@/repos/Workout"
import { WorkoutExerciseRepo } from "@/repos/WorkoutExercise"
import { workoutDetailMocks } from "../__mocks__/workoutDetailMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { Router, useLocalSearchParams, useRouter } from "expo-router"
import { useAddWorkoutExerciseContext } from "@/providers/addWorkoutExercise"
import React, { useEffect } from "react"
import { ExerciseModel } from "@/domains/Exercise"

const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mocked(useRouter).mockReturnValue({
	push: mockPush,
	back: mockBack,
} as unknown as Router)

jest.mocked(useLocalSearchParams).mockReturnValue({
	workoutId: workoutDetailMocks.workout.id,
})

describe("Workout Detail Screen (Integration)", () => {
	beforeEach(async () => {
		await asTestableRepository(WorkoutRepo).clear()
		await asTestableRepository(WorkoutExerciseRepo).clear()
		queryClient.clear()
		jest.clearAllMocks()
		jest.mocked(useRouter).mockReturnValue({
			push: mockPush,
			back: mockBack,
		} as unknown as Router)
		jest.mocked(useLocalSearchParams).mockReturnValue({
			workoutId: workoutDetailMocks.workout.id,
		})
		await asTestableRepository(WorkoutRepo).seed([workoutDetailMocks.workout])
	})

	it("should show loading state on start", () => {
		render(<WorkoutDetail />)
		expect(
			screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.LOADING_STATE),
		).toBeTruthy()
	})

	it("should show empty state when workout has no exercises", async () => {
		render(<WorkoutDetail />)
		expect(
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EMPTY_STATE),
		).toBeTruthy()
	})

	it("should hide start workout button when there are no exercises", async () => {
		render(<WorkoutDetail />)
		await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EMPTY_STATE)
		expect(
			screen.queryByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.START_WORKOUT_BUTTON),
		).toBeFalsy()
	})

	it("should show exercises after loading", async () => {
		await asTestableRepository(WorkoutExerciseRepo).seed([
			{ ...workoutDetailMocks.exercises[0], id: "we-1" },
			{ ...workoutDetailMocks.exercises[1], id: "we-2" },
		])

		render(<WorkoutDetail />)

		const items = await screen.findAllByTestId(
			WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM,
		)
		expect(items.length).toBe(2)
	})

	it("should show start workout button when exercises exist", async () => {
		await asTestableRepository(WorkoutExerciseRepo).seed([
			{ ...workoutDetailMocks.exercises[0], id: "we-1" },
		])

		render(<WorkoutDetail />)

		await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

		expect(
			screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.START_WORKOUT_BUTTON),
		).toBeTruthy()
	})

	describe("add exercise modal", () => {
		it("should open modal when add exercise button is pressed", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EMPTY_STATE)

			fireEvent.press(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_EXERCISE_BUTTON),
			)

			expect(
				await screen.findByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.SEARCH_EXERCISES_BUTTON,
				),
			).toBeTruthy()
		})

		it("should close modal when cancel button is pressed", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EMPTY_STATE)

			fireEvent.press(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_EXERCISE_BUTTON),
			)

			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CANCEL_BUTTON)
			fireEvent.press(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CANCEL_BUTTON),
			)

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						WORKOUT_DETAIL_SCREEN_TEST_IDS.SEARCH_EXERCISES_BUTTON,
					),
				).toBeFalsy()
			})
		})

		it("should navigate to search exercises and close modal when search button is pressed", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EMPTY_STATE)

			fireEvent.press(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_EXERCISE_BUTTON),
			)

			await screen.findByTestId(
				WORKOUT_DETAIL_SCREEN_TEST_IDS.SEARCH_EXERCISES_BUTTON,
			)
			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.SEARCH_EXERCISES_BUTTON,
				),
			)

			expect(mockPush).toHaveBeenCalledWith({
				pathname: "/(application)/workout/[workoutId]/searchExercises",
				params: { workoutId: workoutDetailMocks.workout.id },
			})
		})

		it("should open modal automatically when context has a selected exercise", async () => {
			function WorkoutDetailWithExercise({
				exercise,
			}: {
				exercise: ExerciseModel
			}) {
				const { addWorkoutExercise } = useAddWorkoutExerciseContext()
				useEffect(() => {
					addWorkoutExercise(exercise)
				}, [])
				return <WorkoutDetail />
			}

			render(
				<WorkoutDetailWithExercise
					exercise={workoutDetailMocks.exercises[0] as unknown as ExerciseModel}
				/>,
			)

			expect(
				await screen.findByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.SEARCH_EXERCISES_BUTTON,
				),
			).toBeTruthy()
		})

		it("should keep confirm button disabled until all fields are filled", async () => {
			function WorkoutDetailWithExercise({
				exercise,
			}: {
				exercise: ExerciseModel
			}) {
				const { addWorkoutExercise } = useAddWorkoutExerciseContext()
				useEffect(() => {
					addWorkoutExercise(exercise)
				}, [])
				return <WorkoutDetail />
			}

			render(
				<WorkoutDetailWithExercise
					exercise={workoutDetailMocks.exercises[0] as unknown as ExerciseModel}
				/>,
			)

			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CONFIRM_BUTTON)

			expect(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CONFIRM_BUTTON)
					.props.accessibilityState?.disabled,
			).toBeTruthy()

			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SERIES_INPUT),
				"3",
			)
			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REPS_INPUT),
				"10",
			)
			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REST_INPUT),
				"60",
			)

			await waitFor(() => {
				expect(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CONFIRM_BUTTON)
						.props.accessibilityState?.disabled,
				).toBeFalsy()
			})
		})

		it("should add exercise to workout and close modal on valid form submission", async () => {
			function WorkoutDetailWithExercise({
				exercise,
			}: {
				exercise: ExerciseModel
			}) {
				const { addWorkoutExercise } = useAddWorkoutExerciseContext()
				useEffect(() => {
					addWorkoutExercise(exercise)
				}, [])
				return <WorkoutDetail />
			}

			render(
				<WorkoutDetailWithExercise
					exercise={workoutDetailMocks.exercises[0] as unknown as ExerciseModel}
				/>,
			)

			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CONFIRM_BUTTON)

			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SERIES_INPUT),
				"3",
			)
			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REPS_INPUT),
				"10",
			)
			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REST_INPUT),
				"60",
			)

			await waitFor(() => {
				expect(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CONFIRM_BUTTON)
						.props.accessibilityState?.disabled,
				).toBeFalsy()
			})

			await act(async () => {
				fireEvent.press(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CONFIRM_BUTTON),
				)
			})

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						WORKOUT_DETAIL_SCREEN_TEST_IDS.SEARCH_EXERCISES_BUTTON,
					),
				).toBeFalsy()
			})
		})
	})

	describe("edit exercise", () => {
		beforeEach(async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutDetailMocks.exercisesWithSets[0],
			])
		})

		it("should open edit modal with pre-filled values when edit button is pressed", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await waitFor(() => {
				expect(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SERIES_INPUT).props
						.value,
				).toBe("1")
				expect(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REPS_INPUT).props
						.value,
				).toBe("10")
				expect(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REST_INPUT).props
						.value,
				).toBe("60")
			})
		})

		it("should hide search exercises button in edit mode", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON)

			expect(
				screen.queryByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.SEARCH_EXERCISES_BUTTON,
				),
			).toBeFalsy()
		})

		it("should keep save button disabled when series is set to an invalid value", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON)

			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SERIES_INPUT),
				"0",
			)

			await waitFor(() => {
				expect(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON)
						.props.accessibilityState?.disabled,
				).toBeTruthy()
			})
		})

		it("should enable save button when all fields have valid values", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON)

			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SERIES_INPUT),
				"3",
			)
			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REPS_INPUT),
				"10",
			)
			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REST_INPUT),
				"60",
			)

			await waitFor(() => {
				expect(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON)
						.props.accessibilityState?.disabled,
				).toBeFalsy()
			})
		})

		it("should close edit modal after saving with valid values", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON)

			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SERIES_INPUT),
				"3",
			)
			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REPS_INPUT),
				"12",
			)
			fireEvent.changeText(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.REST_INPUT),
				"90",
			)

			await waitFor(() => {
				expect(
					screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON)
						.props.accessibilityState?.disabled,
				).toBeFalsy()
			})

			await act(async () => {
				fireEvent.press(
					screen.getByTestId(
						WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON,
					),
				)
			})

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON,
					),
				).toBeFalsy()
			})
		})

		it("should close edit modal without changing data when cancel is pressed", async () => {
			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON)

			fireEvent.press(
				screen.getByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CANCEL_BUTTON),
			)

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON,
					),
				).toBeFalsy()
			})

			expect(
				screen.queryAllByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(1)
		})
	})

	describe("delete exercise", () => {
		it("should open delete modal when delete button is pressed", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutDetailMocks.exercisesWithSets[0],
			])

			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			expect(
				await screen.findByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CONFIRM_BUTTON,
				),
			).toBeTruthy()
		})

		it("should close delete modal without removing exercise when cancel is pressed", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutDetailMocks.exercisesWithSets[0],
				workoutDetailMocks.exercisesWithSets[1],
			])

			render(<WorkoutDetail />)
			await screen.findAllByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await screen.findByTestId(
				WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CONFIRM_BUTTON,
			)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CANCEL_BUTTON,
				),
			)

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CONFIRM_BUTTON,
					),
				).toBeFalsy()
			})

			expect(
				screen.queryAllByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(2)
		})

		it("should remove exercise from list after confirming deletion", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutDetailMocks.exercisesWithSets[0],
				workoutDetailMocks.exercisesWithSets[1],
			])

			render(<WorkoutDetail />)
			await screen.findAllByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await screen.findByTestId(
				WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CONFIRM_BUTTON,
			)

			await act(async () => {
				fireEvent.press(
					screen.getByTestId(
						WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CONFIRM_BUTTON,
					),
				)
			})

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)
						.length,
				).toBe(1)
			})
		})

		it("should show empty state after deleting the last exercise", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutDetailMocks.exercisesWithSets[0],
			])

			render(<WorkoutDetail />)
			await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM)

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({ id: "we-1" }),
				),
			)

			await screen.findByTestId(
				WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CONFIRM_BUTTON,
			)

			await act(async () => {
				fireEvent.press(
					screen.getByTestId(
						WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CONFIRM_BUTTON,
					),
				)
			})

			expect(
				await screen.findByTestId(WORKOUT_DETAIL_SCREEN_TEST_IDS.EMPTY_STATE),
			).toBeTruthy()
		})
	})
})
