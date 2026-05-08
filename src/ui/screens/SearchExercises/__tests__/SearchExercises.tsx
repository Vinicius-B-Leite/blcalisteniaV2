import { act, asTestableRepository, fireEvent, render, screen, waitFor } from "@/tests"
import { SearchExercises } from "../SearchExercises"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "../constants"
import { ExerciseRepo } from "@/repos/Exercise"
import { AuthRepo } from "@/repos/Auth"
import { searchExercisesMocks } from "../__mocks__/searchExercisesMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { useRouter } from "expo-router"
import { TOAST_ROOT_TEST_ID, TOAST_MESSAGE_TEST_ID } from "@/components/core/Toast"

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

	it("should disable the Add button when no exercise is selected", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

		const addButton = screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON)
		expect(addButton.props.accessibilityState?.disabled).toBeTruthy()
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

	describe("Unified List", () => {
		it("should display 5 default and 3 custom exercises as a single unified list of 8 items", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			for (const base of searchExercisesMocks.userExercisesBase) {
				await ExerciseRepo.createExercise({ ...base, userId: user.id })
			}

			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(8)
			})
		})
	})

	describe("Text Filter", () => {
		it("should filter within the unified list by text and restore all items when cleared", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			for (const base of searchExercisesMocks.userExercisesBase) {
				await ExerciseRepo.createExercise({ ...base, userId: user.id })
			}

			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(8)
			})

			const searchInput = screen.getByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT,
			)

			// "Exercício" matches all 3 custom exercises (Exercício A, B, C)
			fireEvent.changeText(searchInput, "Exercício")

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(3)
			})

			// "Flex" matches only the default exercise "Flexão"
			fireEvent.changeText(searchInput, "Flex")

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(1)
			})

			// Clearing restores all 8
			fireEvent.changeText(searchInput, "")

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(8)
			})
		})
	})

	describe("Muscle Group Filter", () => {
		it("should filter within the unified list by muscle group and remove filter when deselected", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			for (const base of searchExercisesMocks.userExercisesBase) {
				await ExerciseRepo.createExercise({ ...base, userId: user.id })
			}

			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(8)
			})

			// "legs" matches "Agachamento" (default) + "Exercício A" (custom) = 2
			const legsChip = screen.getByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CATEGORY_CHIP({ muscleGroup: "legs" }),
			)
			fireEvent.press(legsChip)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(2)
			})

			// Deselecting restores all 8
			fireEvent.press(legsChip)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(8)
			})
		})

		it("should apply text and muscle group filters simultaneously within the unified list", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			for (const base of searchExercisesMocks.userExercisesBase) {
				await ExerciseRepo.createExercise({ ...base, userId: user.id })
			}

			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(8)
			})

			// Filter by "chest" → Flexão + Supino = 2
			fireEvent.press(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.CATEGORY_CHIP({
						muscleGroup: "chest",
					}),
				),
			)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(2)
			})

			// Add text "Supin" while chest is selected → only Supino = 1
			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"Supin",
			)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(1)
			})

			// Add text that doesn't match chest exercises → 0
			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"Agacha",
			)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(0)
			})
		})
	})

	describe("Deletion", () => {
		async function seedCustomExercise() {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			const created = await ExerciseRepo.createExercise({
				...searchExercisesMocks.userExercisesBase[0],
				userId: user.id,
			})
			return { user, created }
		}

		it("should open delete modal when trash button is pressed", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			// Unified list should show 6 items (5 default + 1 custom)
			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(6)
			})

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

		it("should remove exercise from the unified list and close modal on confirm", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(6)
			})

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
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(5)
				expect(
					screen.queryByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
					),
				).toBeFalsy()
			})
		})

		it("should close modal without removing the exercise from the unified list on cancel", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(6)
			})

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
				screen.queryAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBe(6)
		})

		it("should close modal and show error toast on delete failure", async () => {
			const { created } = await seedCustomExercise()
			jest.spyOn(ExerciseRepo, "deleteExercise").mockRejectedValueOnce(
				new Error("Delete failed"),
			)

			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(6)
			})

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
				expect(screen.getByTestId(TOAST_ROOT_TEST_ID)).toBeTruthy()
				expect(screen.getByTestId(TOAST_MESSAGE_TEST_ID).props.children).toBe(
					"Ocorreu um erro ao deletar o exercício",
				)
				expect(
					screen.queryByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
					),
				).toBeFalsy()
			})
		})

		it("should update the unified list in background after closing modal during loading (success)", async () => {
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

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(6)
			})

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

			expect(
				screen.queryAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
					.length,
			).toBeGreaterThan(0)

			await act(async () => {
				resolveDelete()
			})

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(5)
			})
		})

		it("should show error toast in background after closing modal during loading (error)", async () => {
			const { created } = await seedCustomExercise()

			let rejectDelete!: (err: Error) => void
			const pendingDelete = new Promise<void>((_, reject) => {
				rejectDelete = reject
			})
			jest.spyOn(ExerciseRepo, "deleteExercise").mockReturnValueOnce(pendingDelete)

			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(6)
			})

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

			await act(async () => {
				rejectDelete(new Error("Delete failed in background"))
			})

			await waitFor(() => {
				expect(screen.getByTestId(TOAST_ROOT_TEST_ID)).toBeTruthy()
				expect(screen.getByTestId(TOAST_MESSAGE_TEST_ID).props.children).toBe(
					"Ocorreu um erro ao deletar o exercício",
				)
			})
		})
	})

	describe("error handling", () => {
		it("should show error toast when deleting an exercise fails (natural error)", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			const created = await ExerciseRepo.createExercise({
				...searchExercisesMocks.userExercisesBase[0],
				userId: user.id,
			})

			render(<SearchExercises />)

			await waitFor(() => {
				expect(
					screen.queryAllByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM,
					).length,
				).toBe(6)
			})

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

			await asTestableRepository(ExerciseRepo).clear()

			await act(async () => {
				fireEvent.press(confirmBtn)
			})

			await screen.findByTestId(TOAST_ROOT_TEST_ID)
			expect(screen.getByTestId(TOAST_MESSAGE_TEST_ID).props.children).toBe(
				"Exercício não encontrado",
			)
		})
	})
})
