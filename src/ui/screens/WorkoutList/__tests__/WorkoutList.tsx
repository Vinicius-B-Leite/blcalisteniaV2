import { act, asTestableRepository, fireEvent, render, screen, waitFor } from "@/tests"
import { WorkoutList } from "../WorkoutList"
import { WORKOUT_LIST_SCREEN_TEST_IDS } from "../constants"
import { WorkoutRepo } from "@/repos/Workout"
import { workoutListMocks } from "../__mocks__/workoutListMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { Router, useRouter } from "expo-router"
import { TOAST_ROOT_TEST_ID, TOAST_MESSAGE_TEST_ID } from "@/components/core/Toast"
import { WorkoutModel } from "@/domains/Workout"

const mockPush = jest.fn()

jest.mocked(useRouter).mockReturnValue({
	push: mockPush,
} as unknown as Router)

describe("Workout List Screen (Integration)", () => {
	beforeEach(async () => {
		await asTestableRepository(WorkoutRepo).clear()
		queryClient.clear()
		jest.clearAllMocks()
	})

	it("should render correctly", () => {
		render(<WorkoutList />)
	})

	describe("Workout display", () => {
		it("should show loading state when fetching workouts", () => {
			render(<WorkoutList />)

			expect(
				screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.LOADING_STATE),
			).toBeTruthy()
		})

		it("should show workout items after loading", async () => {
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[0])

			render(<WorkoutList />)

			expect(
				screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.LOADING_STATE),
			).toBeTruthy()

			const workoutItems = await screen.findAllByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM,
			)

			expect(workoutItems.length).toBeGreaterThan(0)
		})

		it("should show empty state when no workouts are available", async () => {
			await asTestableRepository(WorkoutRepo).clear()
			render(<WorkoutList />)

			expect(
				screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.LOADING_STATE),
			).toBeTruthy()

			await waitFor(
				() => {
					expect(
						screen.queryByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.LOADING_STATE),
					).toBeFalsy()
				},
				{ timeout: 2000 },
			)

			const workoutItems = screen.queryAllByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM,
			)

			expect(workoutItems.length).toBe(0)

			expect(
				screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.EMPTY_STATE),
			).toBeTruthy()
		})

		it("should refresh the workout list when pull to refresh is triggered", async () => {
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[0])
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[1])

			render(<WorkoutList />)

			const workoutItems = await screen.findAllByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM,
			)
			expect(workoutItems.length).toBe(2)

			await act(async () => {
				WorkoutRepo.createWorkout(workoutListMocks.createWorkout[2])
			})

			const flatList = screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_LIST)

			await act(async () => {
				flatList.props.refreshControl.props.onRefresh()
			})

			await waitFor(() => {
				const updatedWorkoutItems = screen.getAllByTestId(
					WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM,
				)
				expect(updatedWorkoutItems.length).toBe(3)
			})
		})
	})

	describe("Search functionality", () => {
		it("should filter workouts searching by title and show all workouts when search is cleared", async () => {
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[0])
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[1])

			render(<WorkoutList />)

			const workoutItems = await screen.findAllByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM,
			)
			expect(workoutItems.length).toBe(2)

			const searchInput = screen.getByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.SEARCH_INPUT,
			)
			fireEvent.changeText(
				searchInput,
				workoutListMocks.createWorkout[0].title.substring(0, 11),
			)

			const filteredWorkoutItems = await screen.findAllByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM,
			)

			expect(filteredWorkoutItems.length).toBe(1)
			expect(screen.getByText(workoutListMocks.createWorkout[0].title)).toBeTruthy()

			fireEvent.changeText(searchInput, "")

			const allWorkoutItems = await screen.findAllByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM,
			)

			expect(allWorkoutItems.length).toBe(2)
		})

		it("should show message feedback when no workouts match the search query", async () => {
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[0])

			render(<WorkoutList />)

			const searchInput = await screen.findByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.SEARCH_INPUT,
			)

			fireEvent.changeText(searchInput, "Nonexistent Workout")

			expect(
				await screen.findByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.NO_SEARCH_RESULTS),
			).toBeTruthy()
		})
	})

	describe("Workout deletion", () => {
		it("should delete a workout and update the list", async () => {
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[0])

			render(<WorkoutList />)

			const workoutItem = await screen.findByText(
				workoutListMocks.createWorkout[0].title,
			)
			expect(workoutItem).toBeTruthy()

			const openModalDelete = screen.getByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.DELETE_BUTTON({
					id: workoutListMocks.createWorkout[0].id,
				}),
			)

			fireEvent.press(openModalDelete)

			const confirmDeleteButton = await screen.findByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.DELETE_BUTTON({
					id: "confirm",
				}),
			)

			await act(async () => {
				await fireEvent.press(confirmDeleteButton)
			})

			await waitFor(async () => {
				expect(
					screen.queryByText(workoutListMocks.createWorkout[0].title),
				).toBeFalsy()

				expect(
					await screen.findByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.EMPTY_STATE),
				).toBeTruthy()
			})
		})
	})

	describe("Navigation", () => {
		it("should navigate to workout details when redirect button is pressed with correct workout ID", async () => {
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[0])
			WorkoutRepo.createWorkout(workoutListMocks.createWorkout[1])

			render(<WorkoutList />)

			const toDetailsButtons = await screen.findAllByTestId(
				new RegExp(WORKOUT_LIST_SCREEN_TEST_IDS.TO_DETAILS_BUTTON({ id: ".*" })),
			)

			fireEvent.press(toDetailsButtons[1])

			expect(mockPush).toHaveBeenCalledWith({
				pathname: "/(application)/workout/[workoutId]",
				params: { workoutId: workoutListMocks.createWorkout[1].id },
			})
		})
	})

	describe("Error handling", () => {
		it("should show error toast when deleting a workout fails", async () => {
			await asTestableRepository(WorkoutRepo).seed([
				workoutListMocks.createWorkout[0],
			])

			render(<WorkoutList />)

			const deleteButton = await screen.findByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.DELETE_BUTTON({
					id: workoutListMocks.createWorkout[0].id,
				}),
			)
			fireEvent.press(deleteButton)

			const confirmButton = await screen.findByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.DELETE_BUTTON({ id: "confirm" }),
			)

			await asTestableRepository(WorkoutRepo).clear()

			await act(async () => {
				fireEvent.press(confirmButton)
			})

			await screen.findByTestId(TOAST_ROOT_TEST_ID)
			expect(screen.getByTestId(TOAST_MESSAGE_TEST_ID).props.children).toBe(
				"Treino não encontrado",
			)
		})
	})

	describe("Pagination", () => {
		it("should not show loading spinner when list has fewer items than page size", async () => {
			await asTestableRepository(WorkoutRepo).seed(generateWorkouts(5))

			render(<WorkoutList />)

			await screen.findAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)

			expect(
				screen.queryByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.LOADING_NEXT_PAGE),
			).toBeNull()
		})

		it("should load next page when end of list is reached (infinite scroll)", async () => {
			await asTestableRepository(WorkoutRepo).seed(generateWorkouts(21))

			render(<WorkoutList />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(20)
			})

			const flatList = screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_LIST)
			await act(async () => {
				flatList.props.onEndReached()
			})

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(21)
			})
		})

		it("should reset to page 0 when search text changes", async () => {
			await asTestableRepository(WorkoutRepo).seed([
				...generateWorkouts(3, "Força", 100),
				...generateWorkouts(18, "Aeróbico", 200),
			])

			render(<WorkoutList />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(20)
			})

			const searchInput = screen.getByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.SEARCH_INPUT,
			)
			fireEvent.changeText(searchInput, "Força")

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(3)
			})
		})

		it("should support pagination combined with search text", async () => {
			await asTestableRepository(WorkoutRepo).seed(generateWorkouts(25, "Força"))

			render(<WorkoutList />)

			const searchInput = await screen.findByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.SEARCH_INPUT,
			)
			fireEvent.changeText(searchInput, "Força")

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(20)
			})

			const flatList = screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_LIST)
			await act(async () => {
				flatList.props.onEndReached()
			})

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(25)
			})
		})

		it("should show empty state after pull-to-refresh when all items removed", async () => {
			const workouts = generateWorkouts(21)
			await asTestableRepository(WorkoutRepo).seed(workouts)

			render(<WorkoutList />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(20)
			})

			await act(async () => {
				screen
					.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_LIST)
					.props.onEndReached()
			})

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(21)
			})

			await asTestableRepository(WorkoutRepo).clear()

			await act(async () => {
				screen
					.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_LIST)
					.props.refreshControl.props.onRefresh()
			})

			await waitFor(() => {
				expect(
					screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.EMPTY_STATE),
				).toBeTruthy()
			})
		})

		it("should reset pagination after deleting a workout", async () => {
			const workouts = generateWorkouts(21)
			await asTestableRepository(WorkoutRepo).seed(workouts)

			render(<WorkoutList />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(20)
			})

			const flatList = screen.getByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_LIST)
			await act(async () => {
				flatList.props.onEndReached()
			})

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(21)
			})

			fireEvent.press(
				screen.getByTestId(
					WORKOUT_LIST_SCREEN_TEST_IDS.DELETE_BUTTON({ id: workouts[0].id }),
				),
			)

			const confirmButton = await screen.findByTestId(
				WORKOUT_LIST_SCREEN_TEST_IDS.DELETE_BUTTON({ id: "confirm" }),
			)
			await act(async () => {
				fireEvent.press(confirmButton)
			})

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM)
						.length,
				).toBe(20)
			})
		})
	})
})

function generateWorkouts(
	count: number,
	titlePrefix = "Treino",
	startId = 100,
): WorkoutModel[] {
	return Array.from({ length: count }, (_, i) => ({
		id: String(startId + i),
		title: `${titlePrefix} ${String(i + 1).padStart(3, "0")}`,
		category: "strength" as const,
		imageUrl: "strength.jpg",
		description: "Description",
		weekDaysFrequency: [1] as WorkoutModel["weekDaysFrequency"],
	}))
}
