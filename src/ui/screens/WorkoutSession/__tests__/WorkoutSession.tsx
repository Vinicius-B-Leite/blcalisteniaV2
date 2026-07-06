import { asTestableRepository, render, screen, waitFor } from "@/tests"
import { WorkoutSession } from "../WorkoutSession"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../constants"
import { WorkoutRepo } from "@/repos/Workout"
import { WorkoutExerciseRepo } from "@/repos/WorkoutExercise"
import { workoutSessionMocks } from "../__mocks__/workoutSessionMocks"
import { queryClient } from "@/infra/services/queryCache/implementations/reactQuery/ReactQueryProvider"
import { Router, useLocalSearchParams, useRouter } from "expo-router"
import { TOAST_ROOT_TEST_ID, TOAST_MESSAGE_TEST_ID } from "@/components/core/Toast"

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
				screen.queryAllByTestId(WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM)
					.length,
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
			screen.queryAllByTestId(
				WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_INDICATOR,
			).length,
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
})
