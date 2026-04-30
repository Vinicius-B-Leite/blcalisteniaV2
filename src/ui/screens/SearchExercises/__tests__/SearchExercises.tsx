import { act, asTestableRepository, fireEvent, render, screen, waitFor } from "@/tests"
import { SearchExercises } from "../SearchExercises"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "../constants"
import { ExerciseRepo } from "@/repos/Exercise"
import { AuthRepo } from "@/repos/Auth"
import { searchExercisesMocks } from "../__mocks__/searchExercisesMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { useRouter } from "expo-router"

const mockBack = jest.fn()

jest.mocked(useRouter).mockReturnValue({
	back: mockBack,
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

	describe("deletion", () => {
		async function seedCustomExercise() {
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			const created = await ExerciseRepo.createExercise({
				...searchExercisesMocks.userExercisesBase[0],
				userId: user.id,
			})
			return { user, created }
		}

		it("should open delete modal with the exercise name when trash button is pressed", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
			)

			fireEvent.press(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({
						id: created.id,
					}),
				),
			)

			expect(
				await screen.findByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
				),
			).toBeTruthy()
			expect(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CANCEL,
				),
			).toBeTruthy()
		})

		it("should remove exercise from list and close modal on confirm", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
			)

			fireEvent.press(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({
						id: created.id,
					}),
				),
			)

			const confirmBtn = await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
			)

			await act(async () => {
				fireEvent.press(confirmBtn)
			})

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
					).length,
				).toBe(0)
				expect(
					screen.queryByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
					),
				).toBeFalsy()
			})
		})

		it("should close modal without deleting exercise on cancel", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
			)

			fireEvent.press(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({
						id: created.id,
					}),
				),
			)

			const cancelBtn = await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CANCEL,
			)

			fireEvent.press(cancelBtn)

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
					),
				).toBeFalsy()
			})

			expect(
				screen.queryAllByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
				).length,
			).toBeGreaterThan(0)
		})

		it("should close modal and call console.error on delete failure", async () => {
			const { created } = await seedCustomExercise()
			const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
			jest.spyOn(ExerciseRepo, "deleteExercise").mockRejectedValueOnce(
				new Error("Delete failed"),
			)

			render(<SearchExercises />)

			await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
			)

			fireEvent.press(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({
						id: created.id,
					}),
				),
			)

			const confirmBtn = await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
			)

			await act(async () => {
				fireEvent.press(confirmBtn)
			})

			await waitFor(() => {
				expect(consoleSpy).toHaveBeenCalled()
				expect(
					screen.queryByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
					),
				).toBeFalsy()
			})

			consoleSpy.mockRestore()
		})

		it("should update list in background after closing modal during loading (success)", async () => {
			const { created } = await seedCustomExercise()

			const originalDeleteExercise = ExerciseRepo.deleteExercise
			let resolveDelete!: () => void
			const pendingDelete = new Promise<void>((resolve) => {
				resolveDelete = resolve
			})
			jest.spyOn(ExerciseRepo, "deleteExercise").mockImplementationOnce(
				async (id: string) => {
					await pendingDelete
					return originalDeleteExercise.call(ExerciseRepo, id)
				},
			)

			render(<SearchExercises />)

			await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
			)

			fireEvent.press(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({
						id: created.id,
					}),
				),
			)

			const confirmBtn = await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
			)

			fireEvent.press(confirmBtn)

			// Close modal while loading is in progress
			const cancelBtn = screen.getByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CANCEL,
			)
			fireEvent.press(cancelBtn)

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
					),
				).toBeFalsy()
			})

			// Exercise still in list (operation still pending)
			expect(
				screen.queryAllByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
				).length,
			).toBeGreaterThan(0)

			// Resolve background operation
			await act(async () => {
				resolveDelete()
			})

			// List should update without the deleted exercise
			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
					).length,
				).toBe(0)
			})
		})

		it("should call console.error in background after closing modal during loading (error)", async () => {
			const { created } = await seedCustomExercise()
			const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

			let rejectDelete!: (err: Error) => void
			const pendingDelete = new Promise<void>((_, reject) => {
				rejectDelete = reject
			})
			jest.spyOn(ExerciseRepo, "deleteExercise").mockReturnValueOnce(pendingDelete)

			render(<SearchExercises />)

			await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
			)

			fireEvent.press(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({
						id: created.id,
					}),
				),
			)

			const confirmBtn = await screen.findByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
			)

			fireEvent.press(confirmBtn)

			// Close modal while loading is in progress
			const cancelBtn = screen.getByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CANCEL,
			)
			fireEvent.press(cancelBtn)

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
					),
				).toBeFalsy()
			})

			// Reject background operation
			await act(async () => {
				rejectDelete(new Error("Delete failed in background"))
			})

			await waitFor(() => {
				expect(consoleSpy).toHaveBeenCalled()
			})

			consoleSpy.mockRestore()
		})
	})

	it("should call back navigation when Add button is pressed with a selected exercise", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		fireEvent.press(
			screen.getByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.TOGGLE_EXERCISE_BUTTON({
					id: searchExercisesMocks.defaultExercises[0].id,
				}),
			),
		)

		await waitFor(() => {
			expect(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
					.accessibilityState?.disabled,
			).toBeFalsy()
		})

		fireEvent.press(screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON))

		expect(mockBack).toHaveBeenCalled()
	})
})
