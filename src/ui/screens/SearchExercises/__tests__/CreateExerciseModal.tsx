import { describe, it, expect, beforeEach, jest } from "@jest/globals"
import { act, asTestableRepository, fireEvent, render, screen, waitFor } from "@/tests"
import { SearchExercises } from "../SearchExercises"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "../constants"
import { CREATE_EXERCISE_MODAL_TEST_IDS } from "../components/CreateExerciseModal/constants"
import { ExerciseRepo } from "@/repos/Exercise"
import { AuthRepo } from "@/repos/Auth"
import { searchExercisesMocks } from "../__mocks__/searchExercisesMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { useRouter } from "expo-router"

jest.mocked(useRouter).mockReturnValue({
	back: jest.fn(),
} as unknown as ReturnType<typeof useRouter>)

describe("Create Exercise Modal (Integration)", () => {
	beforeEach(async () => {
		await asTestableRepository(ExerciseRepo).clear()
		await AuthRepo.logout()
		queryClient.clear()
		jest.clearAllMocks()
	})

	it("should open the modal when the create exercise button is pressed and close it when cancel pressed", async () => {
		await asTestableRepository(ExerciseRepo).seed(
			searchExercisesMocks.defaultExercises,
		)

		render(<SearchExercises />)

		await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
		await openCreateModal()

		fireEvent.press(screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.CANCEL_BUTTON))

		await expectModalClosed()
	})

	describe("form validation", () => {
		beforeEach(async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)
		})

		it("should keep submit button disabled when name is empty and no muscle group is selected", async () => {
			render(<SearchExercises />)

			await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
			await openCreateModal()

			expectSubmitDisabled()
		})

		it("should keep submit button disabled when name is filled but no muscle group is selected", async () => {
			render(<SearchExercises />)

			await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
			await openCreateModal()

			fireEvent.changeText(
				screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.NAME_INPUT),
				"Supino",
			)

			expectSubmitDisabled()
		})

		it("should keep submit button disabled when a muscle group is selected but name is empty", async () => {
			render(<SearchExercises />)

			await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
			await openCreateModal()

			fireEvent.press(
				screen.getByTestId(
					CREATE_EXERCISE_MODAL_TEST_IDS.MUSCLE_GROUP_CHIP({
						muscleGroup: "chest",
					}),
				),
			)

			expectSubmitDisabled()
		})

		it("should enable submit button when name and at least one muscle group are provided", async () => {
			render(<SearchExercises />)

			await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
			await openCreateModal()

			fireEvent.changeText(
				screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.NAME_INPUT),
				"Supino",
			)

			fireEvent.press(
				screen.getByTestId(
					CREATE_EXERCISE_MODAL_TEST_IDS.MUSCLE_GROUP_CHIP({
						muscleGroup: "chest",
					}),
				),
			)

			await expectSubmitEnabled()
		})
	})

	describe("update", () => {
		it("should pre-fill the form with the initial values when the modal is opened for editing", async () => {
			const created = await createUserExercise()

			render(<SearchExercises />)

			await screen.findAllByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
			)

			await openEditModal(created.id)

			expect(
				screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.NAME_INPUT).props.value,
			).toBe(searchExercisesMocks.userExercisesBase[0].name)

			expect(
				screen.getByTestId(
					CREATE_EXERCISE_MODAL_TEST_IDS.MUSCLE_GROUP_CHIP({
						muscleGroup:
							searchExercisesMocks.userExercisesBase[0].musclesGroups[0],
					}),
				).props.accessibilityState?.selected,
			).toBeTruthy()
		})

		it("should update the exercise name and muscle groups by id after submit", async () => {
			const created = await createUserExercise()

			render(<SearchExercises />)

			await screen.findAllByTestId(
				SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM,
			)

			await openEditModal(created.id)

			fireEvent.changeText(
				screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.NAME_INPUT),
				"Nome Atualizado",
			)

			fireEvent.press(
				screen.getByTestId(
					CREATE_EXERCISE_MODAL_TEST_IDS.MUSCLE_GROUP_CHIP({
						muscleGroup: "back",
					}),
				),
			)

			await expectSubmitEnabled()

			await act(async () => {
				pressSubmit()
			})

			await waitFor(() => {
				expect(
					screen.getByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM_NAME({
							id: created.id,
						}),
					).props.children,
				).toBe("Nome Atualizado")

				expect(
					screen.getByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM_MUSCLES({
							id: created.id,
						}),
					).props.children,
				).toContain("costas")
			})
		})

		it("should not render the edit button for default exercises", async () => {
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)

			render(<SearchExercises />)

			await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

			searchExercisesMocks.defaultExercises.forEach((exercise) => {
				expect(
					screen.queryByTestId(
						SEARCH_EXERCISES_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({
							id: exercise.id,
						}),
					),
				).toBeFalsy()
			})
		})
	})

	describe("creation", () => {
		it("should create the exercise and show it in the custom exercises list after submit", async () => {
			await AuthRepo.signInAnonymous({ name: "Test User" })
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)

			render(<SearchExercises />)

			await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)
			await openCreateModal()
			await createExercise("Supino Reto", ["chest"])
			await expectExerciseVisible("Supino Reto")
			await expectModalClosed()
		})

		it("should clear the form after successful creation so a second exercise can be created fresh", async () => {
			await AuthRepo.signInAnonymous({ name: "Test User" })
			await asTestableRepository(ExerciseRepo).seed(
				searchExercisesMocks.defaultExercises,
			)

			render(<SearchExercises />)

			await screen.findAllByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM)

			// First creation
			await openCreateModal()
			await createExercise("Supino Reto", ["chest"])
			await expectModalClosed()

			// Reopen and assert form is cleared
			await openCreateModal()

			expect(
				screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.NAME_INPUT).props.value,
			).toBe("")

			expectSubmitDisabled()
		})
	})
})

async function openCreateModal() {
	fireEvent.press(
		screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.CREATE_EXERCISE_BUTTON),
	)
	await screen.findByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.MODAL)
}

async function openEditModal(id: string) {
	fireEvent.press(
		screen.getByTestId(SEARCH_EXERCISES_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({ id })),
	)
	await screen.findByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.MODAL)
}

async function createUserExercise() {
	const user = await AuthRepo.signInAnonymous({ name: "Test User" })
	return ExerciseRepo.createExercise({
		...searchExercisesMocks.userExercisesBase[0],
		userId: user.id,
	})
}

async function expectModalClosed() {
	await waitFor(() => {
		expect(screen.queryByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.MODAL)).toBeFalsy()
	})
}

function pressSubmit() {
	fireEvent.press(screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.SUBMIT_BUTTON))
}

function expectSubmitDisabled() {
	expect(
		screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.SUBMIT_BUTTON).props
			.accessibilityState?.disabled,
	).toBeTruthy()
}

async function expectSubmitEnabled() {
	await waitFor(() => {
		expect(
			screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.SUBMIT_BUTTON).props
				.accessibilityState?.disabled,
		).toBeFalsy()
	})
}

async function createExercise(name: string, muscleGroups: string[]) {
	fireEvent.changeText(
		screen.getByTestId(CREATE_EXERCISE_MODAL_TEST_IDS.NAME_INPUT),
		name,
	)
	for (const muscleGroup of muscleGroups) {
		fireEvent.press(
			screen.getByTestId(
				CREATE_EXERCISE_MODAL_TEST_IDS.MUSCLE_GROUP_CHIP({ muscleGroup }),
			),
		)
	}
	await expectSubmitEnabled()
	await act(async () => {
		pressSubmit()
	})
}

async function expectExerciseVisible(name: string) {
	await waitFor(() => {
		const nameEls = screen.queryAllByTestId(
			new RegExp(`${SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISE_ITEM}-name-`),
		)
		expect(nameEls.some((el) => el.props.children === name)).toBeTruthy()
	})
}
