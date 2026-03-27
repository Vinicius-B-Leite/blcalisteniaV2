import { act, asTestableRepository, fireEvent, render, screen, waitFor } from "@/tests"
import { SearchExercises } from "../SearchExercises"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "../constants"
import { ExerciseRepo } from "@/repos/Exercise"
import { AuthRepo } from "@/repos/Auth"
import { searchExercisesMocks } from "../__mocks__/searchExercisesMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { useRouter } from "expo-router"

jest.mocked(useRouter).mockReturnValue({
	back: jest.fn(),
} as unknown as ReturnType<typeof useRouter>)

describe("Search Exercises Screen (Integration)", () => {
	beforeEach(async () => {
		await asTestableRepository(ExerciseRepo).clear()
		await AuthRepo.logout()
		queryClient.clear()
		jest.clearAllMocks()
	})

	it("should show loading state on start", () => {
		render(<SearchExercises />)
		expect(
			screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.LOADING_STATE),
		).toBeTruthy()
	})

	it("should hide custom exercises section when there are no user exercises", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		expect(
			screen.queryByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISES_SECTION,
			),
		).toBeFalsy()
	})

	it("should disable the Add button when no exercise is selected", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		const addButton = screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON)
		expect(addButton.props.accessibilityState?.disabled).toBeTruthy()
	})

	it("should filter by typed text and restore when cleared", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)
		const user = await AuthRepo.signInAnonymous({ name: "Test User" })
		await ExerciseRepo.createExercise({
			...searchExercisesMocks.userExercisesBase[0],
			userId: user.id,
		})
		await ExerciseRepo.createExercise({
			...searchExercisesMocks.userExercisesBase[1],
			userId: user.id,
		})

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		const searchInput = screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT,
		)
		fireEvent.changeText(searchInput, "Flexão")

		await waitFor(() => {
			expect(
				screen.getAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(1)
			expect(
				screen.queryAllByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
				).length,
			).toBe(0)
		})

		fireEvent.changeText(searchInput, "Outro")

		await waitFor(() => {
			expect(
				screen.queryAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(0)
			expect(
				screen.getAllByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
				).length,
			).toBe(1)
		})

		fireEvent.changeText(searchInput, "")

		await waitFor(() => {
			expect(
				screen.getAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(3)
			expect(
				screen.getAllByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
				).length,
			).toBe(2)
		})
	})

	it("should filter by muscle group and remove filter when pressed again", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)
		const user = await AuthRepo.signInAnonymous({ name: "Test User" })
		await ExerciseRepo.createExercise({
			...searchExercisesMocks.userExercisesBase[0],
			userId: user.id,
		})
		await ExerciseRepo.createExercise({
			...searchExercisesMocks.userExercisesBase[1],
			userId: user.id,
		})

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		const chestChip = screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.CATEGORY_CHIP({ muscleGroup: "chest" }),
		)

		fireEvent.press(chestChip)

		await waitFor(() => {
			expect(
				screen.getAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(1)
			expect(
				screen.queryAllByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
				).length,
			).toBe(0)
		})

		fireEvent.press(chestChip)

		const shouldersChip = screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.CATEGORY_CHIP({ muscleGroup: "shoulders" }),
		)

		fireEvent.press(shouldersChip)

		await waitFor(() => {
			expect(
				screen.queryAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(0)
			expect(
				screen.getAllByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
				).length,
			).toBe(1)
		})

		fireEvent.press(shouldersChip)

		await waitFor(() => {
			expect(
				screen.getAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(3)
			expect(
				screen.getAllByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
				).length,
			).toBe(2)
		})
	})

	it("should apply text and muscle group filters simultaneously", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		fireEvent.press(
			screen.getByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CATEGORY_CHIP({ muscleGroup: "chest" }),
			),
		)

		await waitFor(() => {
			expect(
				screen.getAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(1)
		})

		const searchInput = screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT,
		)

		fireEvent.changeText(searchInput, "Flex")

		await waitFor(() => {
			expect(
				screen.getAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(1)
		})

		fireEvent.changeText(searchInput, "Agacha")

		await waitFor(() => {
			expect(
				screen.queryAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(0)
		})
	})

	it("should select and deselect an exercise", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		const toggleBtn = screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.TOGGLE_EXERCISE_BUTTON({
				id: searchExercisesMocks.defaultExercises[0].id,
			}),
		)

		fireEvent.press(toggleBtn)

		await waitFor(() => {
			expect(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
					.accessibilityState?.disabled,
			).toBeFalsy()
		})

		fireEvent.press(toggleBtn)

		await waitFor(() => {
			expect(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
					.accessibilityState?.disabled,
			).toBeTruthy()
		})
	})

	it("should disable the Add button only when all selected exercises are deselected", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		const toggleBtn0 = screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.TOGGLE_EXERCISE_BUTTON({
				id: searchExercisesMocks.defaultExercises[0].id,
			}),
		)
		const toggleBtn1 = screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.TOGGLE_EXERCISE_BUTTON({
				id: searchExercisesMocks.defaultExercises[1].id,
			}),
		)

		fireEvent.press(toggleBtn0)
		fireEvent.press(toggleBtn1)

		await waitFor(() => {
			expect(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
					.accessibilityState?.disabled,
			).toBeFalsy()
		})

		fireEvent.press(toggleBtn0)

		await waitFor(() => {
			expect(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
					.accessibilityState?.disabled,
			).toBeFalsy()
		})

		fireEvent.press(toggleBtn1)

		await waitFor(() => {
			expect(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
					.accessibilityState?.disabled,
			).toBeTruthy()
		})
	})

	it("should show the user-created exercises section when there are exercises with the logged user id", async () => {
		const user = await AuthRepo.signInAnonymous({ name: "Test User" })
		await ExerciseRepo.createExercise({
			...searchExercisesMocks.userExercisesBase[0],
			userId: user.id,
		})

		render(<SearchExercises />)

		expect(
			await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISES_SECTION,
			),
		).toBeTruthy()
	})
})
