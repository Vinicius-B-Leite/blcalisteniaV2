import { Header, Screen, Text } from "@/components/core"
import { useAppTheme } from "@/themes/hooks/useAppTheme"
import { View } from "react-native"
import { stylesTheme } from "./styles"
import { FocusedExercise } from "./components/FocusedExercise/FocusedExercise"
import { Actions, EmptyState, LoadingState } from "./components"
import { useWorkoutSession } from "./useWorkoutSession"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "./constants"
import { MUSCLES_GROUP_LABELS } from "@/constants"

export const WorkoutSession = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)
	const { state } = useWorkoutSession()

	if (state.isLoading) return <LoadingState />
	if (!state.workout) return null
	if (!state.hasExercises)
		return <EmptyState workoutTitle={state.workout.title} />

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.HorizontalCenterTitle
					testID={WORKOUT_SESSION_SCREEN_TEST_IDS.WORKOUT_TITLE}>
					{state.workout.title}
				</Header.HorizontalCenterTitle>
			</Header.Root>

			<View style={styles.sessionTimer}>
				<Text style={styles.sessionTimerLabel} variant="title-small-bold">
					Tempo total de treino:
				</Text>
				<Text style={styles.sessionTimerValue} variant="body-small-reg">
					00:48
				</Text>
			</View>

			<FocusedExercise
				exerciseName={state.focusedExercise.name}
				muscleGroupLabel={state.focusedExercise.musclesGroups
					.map((g) => MUSCLES_GROUP_LABELS[g])
					.join(", ")}
				sets={state.focusedExercise.sets}
				exerciseCount={state.exerciseCount}
			/>
			<Actions />
		</Screen>
	)
}
