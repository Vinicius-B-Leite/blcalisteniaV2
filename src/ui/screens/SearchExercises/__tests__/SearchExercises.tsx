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

	it("should keep Add button enabled even after a filter hides the selected exercise", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await waitForItemCount(5)

		// Select "Agachamento" (legs, id "1")
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

		// "Flex" matches only "Flexão" — hides "Agachamento"
		fireEvent.changeText(
			screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
			"Flex",
		)

		await waitForItemCount(1)

		// ADD button should remain enabled — selection is preserved even when item is filtered out
		expect(
			screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
				.accessibilityState?.disabled,
		).toBeFalsy()
	})

	describe("Unified List", () => {
		it("should display 5 default and 3 custom exercises as a single unified list of 8 items", async () => {
			await seedDefaultAndCustomExercises()

			render(<SearchExercises />)

			await waitForItemCount(8)
		})
	})

	describe("Text Filter", () => {
		it("should filter within the unified list by text and restore all items when cleared", async () => {
			await seedDefaultAndCustomExercises()

			render(<SearchExercises />)

			await waitForItemCount(8)

			const searchInput = screen.getByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT,
			)

			// "Exercício" matches all 3 custom exercises (Exercício A, B, C)
			fireEvent.changeText(searchInput, "Exercício")

			await waitForItemCount(3)

			// "Flex" matches only the default exercise "Flexão"
			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"Flex",
			)

			await waitForItemCount(1)

			// Clearing restores all 8
			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"",
			)

			await waitForItemCount(8)
		})

		it("should paginate search results when more than 20 items match (busca + paginação > 20)", async () => {
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			for (let i = 1; i <= 15; i++) {
				await ExerciseRepo.createExercise({
					name: `Pull ${i < 10 ? "0" + i : i}`,
					musclesGroups: ["back"],
					bannerUrl: null,
					userId: null,
				})
			}
			for (let i = 1; i <= 10; i++) {
				await ExerciseRepo.createExercise({
					name: `Pull Custom ${i < 10 ? "0" + i : i}`,
					musclesGroups: ["back"],
					bannerUrl: null,
					userId: user.id,
				})
			}

			render(<SearchExercises />)

			await waitForItemCount(20)

			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"Pull",
			)

			await waitForItemCount(20)

			await triggerEndReached()

			await waitForItemCount(25)
		})
	})

	describe("Muscle Group Filter", () => {
		it("should filter within the unified list by muscle group and remove filter when deselected", async () => {
			await seedDefaultAndCustomExercises()

			render(<SearchExercises />)

			await waitForItemCount(8)

			// "legs" matches "Agachamento" (default) + "Exercício A" (custom) = 2
			pressChip("legs")

			await waitForItemCount(2)

			// Deselecting restores all 8
			pressChip("legs")

			await waitForItemCount(8)
		})

		it("should apply text and muscle group filters simultaneously within the unified list", async () => {
			await seedDefaultAndCustomExercises()

			render(<SearchExercises />)

			await waitForItemCount(8)

			// Filter by "chest" → Flexão + Supino = 2
			pressChip("chest")

			await waitForItemCount(2)

			// Add text "Supin" while chest is selected → only Supino = 1
			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"Supin",
			)

			await waitForItemCount(1)

			// Add text that doesn't match chest exercises → 0
			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"Agacha",
			)

			await waitForItemCount(0)
		})
	})

	describe("Empty State", () => {
		it("should show 'Exercício não encontrado' when text search returns no results", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)

			render(<SearchExercises />)

			await waitForItemCount(5)

			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"xyzabc",
			)

			await waitFor(() => {
				expect(
					screen.getByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_NOT_FOUND,
					),
				).toBeTruthy()
			})
		})

		it("should show 'Exercício não encontrado' when muscle group filter returns no results", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)

			render(<SearchExercises />)

			await waitForItemCount(5)

			// "biceps" does not match any of the 5 default exercises (legs/back/chest only)
			pressChip("biceps")

			await waitFor(() => {
				expect(
					screen.getByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_NOT_FOUND,
					),
				).toBeTruthy()
			})
		})
	})

	describe("Pagination", () => {
		it("should show first 20 items when 25 total exist (page 1 full)", async () => {
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			await seedManyExercises(user.id, 15, 10)

			render(<SearchExercises />)

			await waitForItemCount(20)
		})

		it("should load all 25 items after onEndReached (infinite scroll)", async () => {
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			await seedManyExercises(user.id, 15, 10)

			render(<SearchExercises />)

			await waitForItemCount(20)

			await triggerEndReached()

			await waitForItemCount(25)
		})

		it("should not show loading indicator after rendering when list is shorter than page size", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)
			await AuthRepo.signInAnonymous({ name: "Test User" })

			render(<SearchExercises />)

			await waitForItemCount(5)

			expect(
				screen.queryByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.LOADING_NEXT_PAGE),
			).toBeFalsy()
		})

		it("should reset pagination and show page 0 after deleting a custom exercise (delete invalida paginação)", async () => {
			const user = await AuthRepo.signInAnonymous({ name: "Test User" })
			const createdExercises: { id: string }[] = []
			for (let i = 1; i <= 25; i++) {
				const ex = await ExerciseRepo.createExercise({
					name: `Custom ${i < 10 ? "0" + i : i}`,
					musclesGroups: ["back"],
					bannerUrl: null,
					userId: user.id,
				})
				createdExercises.push(ex)
			}

			render(<SearchExercises />)

			await waitForItemCount(20)

			await triggerEndReached()

			await waitForItemCount(25)

			// Delete one exercise — should invalidate and reset to page 0
			const { confirmBtn } = await openDeleteModal(createdExercises[0].id)

			await act(async () => {
				fireEvent.press(confirmBtn)
			})

			await waitForItemCount(20)
		})
	})

	describe("Only Custom Filter", () => {
		it("should filter to only custom exercises when 'Meus exercícios' is toggled on", async () => {
			await seedDefaultAndCustomExercises()

			render(<SearchExercises />)

			await waitForItemCount(8)

			fireEvent.press(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ONLY_CUSTOM_FILTER),
			)

			await waitForItemCount(3)
		})

		it("should filter text search within only custom exercises when 'Meus exercícios' is on", async () => {
			await seedDefaultAndCustomExercises()

			render(<SearchExercises />)

			await waitForItemCount(8)

			// Activate only custom filter
			fireEvent.press(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ONLY_CUSTOM_FILTER),
			)

			await waitForItemCount(3)

			// "Exercício" matches all 3 custom exercises
			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"Exercício A",
			)

			await waitForItemCount(1)

			// "Flexão" is a default exercise — should not appear
			fireEvent.changeText(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT),
				"Flex",
			)

			await waitForItemCount(0)
		})

		it("should filter by muscle group combined with 'Meus exercícios' (only custom with chest = 2 items)", async () => {
			await seedWithChestExercises()

			render(<SearchExercises />)

			await waitForItemCount(8)

			fireEvent.press(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ONLY_CUSTOM_FILTER),
			)

			await waitForItemCount(3)

			pressChip("chest")

			await waitForItemCount(2)
		})

		it("should preserve muscle group filter when toggling 'Meus exercícios' off", async () => {
			await seedWithChestExercises()

			render(<SearchExercises />)

			await waitForItemCount(8)

			// Select chest filter first (4 items: 2 default + 2 custom with chest)
			pressChip("chest")

			await waitForItemCount(4)

			// Toggle "Meus exercícios" on → chest + only custom = 2 items
			fireEvent.press(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ONLY_CUSTOM_FILTER),
			)

			await waitForItemCount(2)

			// Toggle "Meus exercícios" off → chest preserved + general list = 4 items
			fireEvent.press(
				screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ONLY_CUSTOM_FILTER),
			)

			await waitForItemCount(4)
		})
	})

	describe("Deletion", () => {
		it("should disable the Add button after the selected exercise is deleted", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			await waitForItemCount(6)

			// Select the custom exercise
			fireEvent.press(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.TOGGLE_EXERCISE_BUTTON({
						id: created.id,
					}),
				),
			)

			await waitFor(() => {
				expect(
					screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
						.accessibilityState?.disabled,
				).toBeFalsy()
			})

			// Delete the selected exercise
			const { confirmBtn } = await openDeleteModal(created.id)
			await act(async () => {
				fireEvent.press(confirmBtn)
			})

			// Selection should be cleared — ADD button disabled
			await waitFor(() => {
				expect(
					screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON).props
						.accessibilityState?.disabled,
				).toBeTruthy()
			})
		})

		it("should open delete modal when trash button is pressed", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			// Unified list should show 6 items (5 default + 1 custom)
			await waitForItemCount(6)

			await openDeleteModal(created.id)
			expect(
				screen.getByTestId(
					SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CANCEL,
				),
			).toBeTruthy()
		})

		it("should remove exercise from the unified list and close modal on confirm", async () => {
			const { created } = await seedCustomExercise()
			render(<SearchExercises />)

			await waitForItemCount(6)

			const { confirmBtn } = await openDeleteModal(created.id)

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

			await waitForItemCount(6)

			await openDeleteModal(created.id)

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
			).toBe(6)
		})

		it("should close modal and show error toast on delete failure", async () => {
			const { created } = await seedCustomExercise()
			jest.spyOn(ExerciseRepo, "deleteExercise").mockRejectedValueOnce(
				new Error("Delete failed"),
			)

			render(<SearchExercises />)

			await waitForItemCount(6)

			const { confirmBtn } = await openDeleteModal(created.id)

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

			await waitForItemCount(6)

			const { confirmBtn } = await openDeleteModal(created.id)

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

			await waitForItemCount(5)
		})

		it("should show error toast in background after closing modal during loading (error)", async () => {
			const { created } = await seedCustomExercise()

			let rejectDelete!: (err: Error) => void
			const pendingDelete = new Promise<void>((_, reject) => {
				rejectDelete = reject
			})
			jest.spyOn(ExerciseRepo, "deleteExercise").mockReturnValueOnce(pendingDelete)

			render(<SearchExercises />)

			await waitForItemCount(6)

			const { confirmBtn } = await openDeleteModal(created.id)

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
			const { created } = await seedCustomExercise()

			render(<SearchExercises />)

			await waitForItemCount(6)

			const { confirmBtn } = await openDeleteModal(created.id)

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

// ─── Helpers ────────────────────────────────────────────────────────────────

function waitForItemCount(count: number) {
	return waitFor(() => {
		expect(
			screen.queryAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
				.length,
		).toBe(count)
	})
}

async function seedDefaultAndCustomExercises() {
	await asTestableRepository(ExerciseRepo).seed(searchExercisesMocks.defaultExercises)
	const user = await AuthRepo.signInAnonymous({ name: "Test User" })
	for (const base of searchExercisesMocks.userExercisesBase) {
		await ExerciseRepo.createExercise({ ...base, userId: user.id })
	}
	return { user }
}

async function seedCustomExercise() {
	await asTestableRepository(ExerciseRepo).seed(searchExercisesMocks.defaultExercises)
	const user = await AuthRepo.signInAnonymous({ name: "Test User" })
	const created = await ExerciseRepo.createExercise({
		...searchExercisesMocks.userExercisesBase[0],
		userId: user.id,
	})
	return { user, created }
}

async function openDeleteModal(id: string) {
	fireEvent.press(
		screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({ id }),
		),
	)
	const confirmBtn = await screen.findByTestId(
		SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_MODAL_CONFIRM,
	)
	return { confirmBtn }
}

function pressChip(muscleGroup: string) {
	fireEvent.press(
		screen.getByTestId(
			SEARCH_EXERCISES_SCREEN_TEST_IDS.CATEGORY_CHIP({ muscleGroup }),
		),
	)
}

async function triggerEndReached() {
	const flatLists = screen.UNSAFE_getAllByType(require("react-native").FlatList)
	// flatLists[0] is the main exercises FlatList; later ones are inner horizontal lists
	const mainList = flatLists[0]
	await act(async () => {
		mainList.props.onEndReached?.()
	})
}

async function seedManyExercises(
	userId: string,
	defaultCount: number,
	customCount: number,
) {
	for (let i = 1; i <= defaultCount; i++) {
		await ExerciseRepo.createExercise({
			name: `Default ${i < 10 ? "0" + i : i}`,
			musclesGroups: ["back"],
			bannerUrl: null,
			userId: null,
		})
	}
	for (let i = 1; i <= customCount; i++) {
		await ExerciseRepo.createExercise({
			name: `Custom ${i < 10 ? "0" + i : i}`,
			musclesGroups: ["back"],
			bannerUrl: null,
			userId,
		})
	}
}

async function seedWithChestExercises() {
	const user = await AuthRepo.signInAnonymous({ name: "Test User" })
	// 5 default: 2 with chest, 3 with other
	await asTestableRepository(ExerciseRepo).seed([
		{
			id: "d1",
			name: "Flexão",
			musclesGroups: ["chest"],
			bannerUrl: null,
			userId: null,
		},
		{
			id: "d2",
			name: "Supino",
			musclesGroups: ["chest"],
			bannerUrl: null,
			userId: null,
		},
		{
			id: "d3",
			name: "Agachamento",
			musclesGroups: ["legs"],
			bannerUrl: null,
			userId: null,
		},
		{
			id: "d4",
			name: "Barra Fixa",
			musclesGroups: ["back"],
			bannerUrl: null,
			userId: null,
		},
		{
			id: "d5",
			name: "Remada",
			musclesGroups: ["back"],
			bannerUrl: null,
			userId: null,
		},
	])
	// 3 custom: 2 with chest, 1 with other
	await ExerciseRepo.createExercise({
		name: "Custom Chest A",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: user.id,
	})
	await ExerciseRepo.createExercise({
		name: "Custom Chest B",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: user.id,
	})
	await ExerciseRepo.createExercise({
		name: "Custom Legs",
		musclesGroups: ["legs"],
		bannerUrl: null,
		userId: user.id,
	})
}
