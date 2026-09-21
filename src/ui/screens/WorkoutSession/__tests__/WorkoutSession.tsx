import { act, asTestableRepository, fireEvent, render, screen, waitFor } from "@/tests"
import { WorkoutSession } from "../WorkoutSession"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../constants"
import { WorkoutRepo } from "@/repos/Workout"
import { WorkoutExerciseRepo } from "@/repos/WorkoutExercise"
import { workoutSessionMocks } from "../__mocks__/workoutSessionMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { Router, useLocalSearchParams, useRouter } from "expo-router"
import { usePreventRemove } from "@react-navigation/native"
import { TOAST_ROOT_TEST_ID, TOAST_MESSAGE_TEST_ID } from "@/components/core/Toast"
import { Alert, TouchableWithoutFeedback } from "react-native"

// Overrides the global expo-router mock (jest.setup.ts) so this suite can also
// stub `useLocalSearchParams`.
jest.mock("expo-router", () => ({
	...jest.requireActual("expo-router"),
	useRouter: jest.fn(),
	useLocalSearchParams: jest.fn(),
}))

// usePreventRemove needs a real NavigationContainer, which customRender doesn't
// provide — stub it so the callback can be triggered manually in tests to
// simulate a native back event (hardware back, swipe gesture, header back).
jest.mock("@react-navigation/native", () => ({
	...jest.requireActual("@react-navigation/native"),
	usePreventRemove: jest.fn(),
}))

const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mocked(useRouter).mockReturnValue({
	push: mockPush,
	back: mockBack,
} as unknown as Router)

jest.mocked(useLocalSearchParams).mockReturnValue({
	workoutId: workoutSessionMocks.workout.id,
})

describe("Workout Session Screen (Integration)", () => {
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
			workoutId: workoutSessionMocks.workout.id,
		})
		await asTestableRepository(WorkoutRepo).seed([workoutSessionMocks.workout])
	})

	// 1 — Loading state ao iniciar
	it("should show loading state on start", () => {
		render(<WorkoutSession />)
		expect(
			screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.LOADING_STATE),
		).toBeTruthy()
	})

	// 2 — Empty state quando o treino não tem exercícios
	it("should show empty state when workout has no exercises", async () => {
		render(<WorkoutSession />)

		expect(
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EMPTY_STATE),
		).toBeTruthy()
		expect(
			screen.queryByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME),
		).toBeFalsy()
	})

	describe("focused exercise", () => {
		// 3 — Renderiza os dados reais do primeiro exercício
		it("should render the first exercise data after loading", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0],
				workoutSessionMocks.exercisesWithSets[1],
			])

			render(<WorkoutSession />)

			const exerciseName = await screen.findByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME,
			)
			expect(exerciseName.props.children).toBe("Flexão de braço")
			expect(
				screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM).length,
			).toBe(3)
		})

		// 4 — Grupo muscular único traduzido
		it("should render a single translated muscle group", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0],
			])

			render(<WorkoutSession />)

			const muscleGroup = await screen.findByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.MUSCLE_GROUP,
			)
			expect(muscleGroup.props.children).toBe("Peitoral")
		})

		// 5 — Múltiplos grupos musculares traduzidos e separados por vírgula
		it("should render multiple translated muscle groups separated by comma", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.multiMuscleExercise,
			])

			render(<WorkoutSession />)

			const muscleGroup = await screen.findByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.MUSCLE_GROUP,
			)
			expect(muscleGroup.props.children).toBe("Peitoral, Tríceps")
		})

		// 6 — Reps reais por série
		it("should render the real reps for each set", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0],
			])

			render(<WorkoutSession />)

			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			const reps = screen.getAllByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_REPS,
			)
			expect(reps[0].props.children).toContain(12)
			expect(reps[1].props.children).toContain(8)
		})
	})

	// 7 — Indicador de progresso reflete o número de exercícios do treino
	it("should render one progress indicator per exercise in the workout", async () => {
		await asTestableRepository(WorkoutExerciseRepo).seed([
			workoutSessionMocks.exercisesWithSets[0],
			workoutSessionMocks.exercisesWithSets[1],
			workoutSessionMocks.exercisesWithSets[2],
		])

		render(<WorkoutSession />)

		await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

		expect(
			screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_INDICATOR)
				.length,
		).toBe(3)
	})

	// 8 — Título real do treino no Header
	it("should render the real workout title in the header", async () => {
		await asTestableRepository(WorkoutExerciseRepo).seed([
			workoutSessionMocks.exercisesWithSets[0],
		])

		render(<WorkoutSession />)

		const title = await screen.findByTestId(
			WORKOUT_SESSION_SCREEN_TEST_IDS.WORKOUT_TITLE,
		)
		expect(title.props.children).toBe("Treino de Força")
	})

	// 9 — Erro / treino não encontrado
	it("should go back and show an error toast when the workout is not found", async () => {
		jest.mocked(useLocalSearchParams).mockReturnValue({
			workoutId: "non-existent-workout-id",
		})

		render(<WorkoutSession />)

		await screen.findByTestId(TOAST_ROOT_TEST_ID)
		expect(screen.getByTestId(TOAST_MESSAGE_TEST_ID).props.children).toBe(
			"Treino não encontrado",
		)

		await waitFor(() => {
			expect(mockBack).toHaveBeenCalled()
		})
	})

	describe("complete set action", () => {
		beforeEach(() => {
			jest.useFakeTimers()
		})

		afterEach(() => {
			jest.useRealTimers()
		})

		// (0) Countdown exibe o tempo de descanso planejado antes de concluir a série
		it("should show the upcoming set's rest time as a preview before completing the set", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0], // rest: 60
			])

			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			expect(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.REST_TIMER_VALUE).props
					.children,
			).toBe("01:00")
		})

		// (a) Concluir série avança, desabilita o próprio botão e habilita +10s/Pular descanso
		it("should disable complete set action and enable rest actions after completing a set", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0],
			])

			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			expectRestActionsDisabled()
			expectCompleteSetEnabled()

			await pressCompleteSet()

			expectCompleteSetDisabled()
			expectRestActionsEnabled()
		})

		// (b) +10s soma no countdown exibido
		it("should add 10 seconds to the rest countdown when pressing +10s", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0],
			])

			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			await pressCompleteSet()

			expect(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.REST_TIMER_VALUE).props
					.children,
			).toBe("01:00")

			act(() => {
				fireEvent.press(
					screen.getByTestId(
						WORKOUT_SESSION_SCREEN_TEST_IDS.ADD_REST_SECONDS_BUTTON,
					),
				)
			})

			expect(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.REST_TIMER_VALUE).props
					.children,
			).toBe("01:10")

			act(() => {
				fireEvent.press(
					screen.getByTestId(
						WORKOUT_SESSION_SCREEN_TEST_IDS.ADD_REST_SECONDS_BUTTON,
					),
				)
			})

			expect(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.REST_TIMER_VALUE).props
					.children,
			).toBe("01:20")
		})

		// (c) Pular descanso zera o countdown e auto-avança
		it("should zero the countdown and auto-advance when skipping rest", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0],
			])

			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			await pressCompleteSet()
			await pressSkipRest()

			expectCompleteSetEnabled()
			expectRestActionsDisabled()
		})

		// (d) Countdown chegando a 0 sozinho auto-avança sem interação
		it("should auto-advance when the countdown reaches zero on its own", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0],
			])

			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			await pressCompleteSet()

			await act(async () => {
				jest.advanceTimersByTime(60_000)
			})

			expectCompleteSetEnabled()
			expectRestActionsDisabled()
		})

		// (e) Concluir a última série de um exercício avança pro próximo exercício
		it("should move to the next exercise after completing the last set", async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0], // 3 sets
				workoutSessionMocks.exercisesWithSets[1], // 2 sets
			])

			render(<WorkoutSession />)
			const exerciseName = await screen.findByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME,
			)
			expect(exerciseName.props.children).toBe("Flexão de braço")

			await completeSetAndSkipRest() // set 1/3
			await completeSetAndSkipRest() // set 2/3
			await completeSetAndSkipRest() // set 3/3 — exhausts the exercise

			await waitFor(() => {
				expect(
					screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)
						.props.children,
				).toBe("Supino")
			})

			expect(
				screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM).length,
			).toBe(2)
			expectCompleteSetEnabled()
			expectRestActionsDisabled()
			expect(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.REST_TIMER_VALUE).props
					.children,
			).toBe("01:30") // preview do descanso do primeiro set do novo exercício (rest: 90)
		})

		// (f) Concluir a última série do último exercício dispara o alert de treino finalizado
		it("should show a finished-workout alert after completing the last set of the last exercise", async () => {
			const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {})

			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.singleSetExercise,
			])

			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			await completeSetAndSkipRest()

			await waitFor(() => {
				expect(alertSpy).toHaveBeenCalledWith(
					expect.stringMatching(/treino finalizado/i),
				)
			})
		})

		describe("set completed indicator", () => {
			// (a) Completar a série mas não avançar o rest timer → círculo continua pending
			it("should keep the set item pending and the progress indicator unchanged when the set is completed but rest hasn't finished", async () => {
				await asTestableRepository(WorkoutExerciseRepo).seed([
					workoutSessionMocks.exercisesWithSets[0], // we-1, 3 sets
				])

				render(<WorkoutSession />)
				await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

				await pressCompleteSet()

				expect(
					screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_COMPLETED)
						.length,
				).toBe(0)
				expect(
					screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_PROGRESS_CURRENT)
						.props.children,
				).toBe("1 de 3 séries")
			})

			// (b) Rest termina naturalmente → 1 círculo completed, indicador atualiza
			it("should mark the set item as completed and update the progress indicator when the rest finishes naturally", async () => {
				await asTestableRepository(WorkoutExerciseRepo).seed([
					workoutSessionMocks.exercisesWithSets[0], // rest: 60
				])

				render(<WorkoutSession />)
				await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

				await pressCompleteSet()

				await act(async () => {
					jest.advanceTimersByTime(60_000)
				})

				expect(
					screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_COMPLETED)
						.length,
				).toBe(1)
				expect(
					screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_PROGRESS_CURRENT)
						.props.children,
				).toBe("2 de 3 séries")
			})

			// (c) Pular descanso também marca a série como completed
			it("should mark the set item as completed and update the progress indicator when skipping rest", async () => {
				await asTestableRepository(WorkoutExerciseRepo).seed([
					workoutSessionMocks.exercisesWithSets[0],
				])

				render(<WorkoutSession />)
				await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

				await completeSetAndSkipRest()

				expect(
					screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_COMPLETED)
						.length,
				).toBe(1)
				expect(
					screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_PROGRESS_CURRENT)
						.props.children,
				).toBe("2 de 3 séries")
			})

			// (d) Completar todas as séries de um exercício → círculos completed acumulam;
			// ao trocar de exercício, círculos do novo exercício voltam pending e o indicador reseta
			it("should accumulate completed set items while finishing an exercise, then reset to pending on the next exercise", async () => {
				await asTestableRepository(WorkoutExerciseRepo).seed([
					workoutSessionMocks.exercisesWithSets[1], // we-2, 2 sets — focused exercise
					workoutSessionMocks.exercisesWithSets[0], // we-1, 3 sets — next exercise
				])

				render(<WorkoutSession />)
				const exerciseName = await screen.findByTestId(
					WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME,
				)
				expect(exerciseName.props.children).toBe("Supino")

				await completeSetAndSkipRest() // set 1/2

				expect(
					screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_COMPLETED)
						.length,
				).toBe(1)
				expect(
					screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_PROGRESS_CURRENT)
						.props.children,
				).toBe("2 de 2 séries")

				await completeSetAndSkipRest() // set 2/2 — exhausts the exercise, advances

				await waitFor(() => {
					expect(
						screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME).props
							.children,
					).toBe("Flexão de braço")
				})

				expect(
					screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_COMPLETED)
						.length,
				).toBe(0)
				expect(
					screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_PROGRESS_CURRENT)
						.props.children,
				).toBe("1 de 3 séries")
			})

			// (e) Última série do último exercício → círculo completed, indicador "1 de 1 séries", alert já existente
			it("should mark the last set of the last exercise as completed and show the final progress indicator", async () => {
				const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {})

				await asTestableRepository(WorkoutExerciseRepo).seed([
					workoutSessionMocks.singleSetExercise,
				])

				render(<WorkoutSession />)
				await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

				await completeSetAndSkipRest()

				expect(
					screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_COMPLETED)
						.length,
				).toBe(1)
				expect(
					screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_PROGRESS_CURRENT)
						.props.children,
				).toBe("1 de 1 séries")
				expect(alertSpy).toHaveBeenCalledWith(
					expect.stringMatching(/treino finalizado/i),
				)
			})

			// (f) Texto de reps nunca muda, independente do estado pending/completed da série
			it("should never change the reps text regardless of the set's pending or completed state", async () => {
				await asTestableRepository(WorkoutExerciseRepo).seed([
					workoutSessionMocks.exercisesWithSets[0], // reps: 12, 8, 15
				])

				render(<WorkoutSession />)
				await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

				const repsBefore = screen.getAllByTestId(
					WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_REPS,
				)
				expect(repsBefore[0].props.children).toContain(12)

				await pressCompleteSet()

				const repsWhilePending = screen.getAllByTestId(
					WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_REPS,
				)
				expect(repsWhilePending[0].props.children).toContain(12)

				await act(async () => {
					jest.advanceTimersByTime(60_000)
				})

				const repsAfterCompleted = screen.getAllByTestId(
					WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_REPS,
				)
				expect(repsAfterCompleted[0].props.children).toContain(12)
			})
		})
	})

	describe("exit confirmation", () => {
		beforeEach(async () => {
			await asTestableRepository(WorkoutExerciseRepo).seed([
				workoutSessionMocks.exercisesWithSets[0],
			])
		})

		it("should open the exit confirmation modal when pressing header go back", async () => {
			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			fireEvent.press(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.GO_BACK_BUTTON),
			)

			expect(
				await screen.findByTestId(
					WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_MODAL,
				),
			).toBeTruthy()
			expect(mockBack).not.toHaveBeenCalled()
		})

		it("should open the exit confirmation modal on native back navigation and prevent it", async () => {
			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			const lastCall = jest.mocked(usePreventRemove).mock.calls.at(-1)
			expect(lastCall?.[0]).toBe(true) // preventRemove ligado enquanto não confirmou saída

			const onPreventedRemove = lastCall?.[1]
			act(() => {
				onPreventedRemove?.({ data: { action: { type: "GO_BACK" } } })
			})

			expect(
				await screen.findByTestId(
					WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_MODAL,
				),
			).toBeTruthy()
		})

		it("should close the modal and stay on screen when tapping outside", async () => {
			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			fireEvent.press(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.GO_BACK_BUTTON),
			)
			await screen.findByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_MODAL,
			)

			const overlay = screen.UNSAFE_getAllByType(TouchableWithoutFeedback)[0]
			await act(async () => {
				fireEvent.press(overlay)
			})

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_MODAL,
					),
				).toBeFalsy()
			})
			expect(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME),
			).toBeTruthy()
			expect(mockBack).not.toHaveBeenCalled()
		})

		it("should close the modal and stay on screen when pressing cancel", async () => {
			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			fireEvent.press(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.GO_BACK_BUTTON),
			)
			await screen.findByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_MODAL,
			)

			await act(async () => {
				fireEvent.press(
					screen.getByTestId(
						WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_CANCEL_BUTTON,
					),
				)
			})

			await waitFor(() => {
				expect(
					screen.queryByTestId(
						WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_MODAL,
					),
				).toBeFalsy()
			})
			expect(mockBack).not.toHaveBeenCalled()
		})

		it("should navigate back when confirming exit", async () => {
			render(<WorkoutSession />)
			await screen.findByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME)

			fireEvent.press(
				screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.GO_BACK_BUTTON),
			)
			await screen.findByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_MODAL,
			)

			await act(async () => {
				fireEvent.press(
					screen.getByTestId(
						WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_CONFIRM_BUTTON,
					),
				)
			})

			await waitFor(() => {
				expect(mockBack).toHaveBeenCalled()
			})
		})
	})
})

// ─── Helpers ────────────────────────────────────────────────────────────────

async function pressCompleteSet() {
	act(() => {
		fireEvent.press(
			screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.COMPLETE_SET_BUTTON),
		)
	})
}

async function pressSkipRest() {
	act(() => {
		fireEvent.press(
			screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SKIP_REST_BUTTON),
		)
	})
}

async function completeSetAndSkipRest() {
	await pressCompleteSet()
	await pressSkipRest()
}

function expectCompleteSetEnabled() {
	expect(
		screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.COMPLETE_SET_BUTTON).props
			.accessibilityState?.disabled,
	).toBeFalsy()
}

function expectCompleteSetDisabled() {
	expect(
		screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.COMPLETE_SET_BUTTON).props
			.accessibilityState?.disabled,
	).toBeTruthy()
}

function expectRestActionsEnabled() {
	expect(
		screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.ADD_REST_SECONDS_BUTTON).props
			.accessibilityState?.disabled,
	).toBeFalsy()
	expect(
		screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SKIP_REST_BUTTON).props
			.accessibilityState?.disabled,
	).toBeFalsy()
}

function expectRestActionsDisabled() {
	expect(
		screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.ADD_REST_SECONDS_BUTTON).props
			.accessibilityState?.disabled,
	).toBeTruthy()
	expect(
		screen.getByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SKIP_REST_BUTTON).props
			.accessibilityState?.disabled,
	).toBeTruthy()
}
