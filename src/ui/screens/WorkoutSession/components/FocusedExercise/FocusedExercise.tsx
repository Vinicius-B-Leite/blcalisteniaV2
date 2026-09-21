import { useAppTheme } from "@/themes/hooks"
import { View } from "react-native"
import { stylesTheme } from "./styles"
import { Text } from "@/components/core"
import { FocusedExerciseProps } from "./types"
import { Summary } from "./Summary"
import { SerieItem } from "./SerieItem"
import { ExerciseContainer } from "./ExerciseContainer"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../../constants"

export const FocusedExercise = ({
	exerciseName,
	muscleGroupLabel,
	sets,
	exerciseCount,
	completedSets,
}: FocusedExerciseProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	const setsCount = sets.length
	const hasManySets = setsCount > 3
	const activeExerciseIndex = 0
	const currentSetNumber = Math.min(completedSets + 1, setsCount)

	return (
		<View style={styles.wrapper}>
			<Summary
				exerciseName={exerciseName}
				muscleGroupLabel={muscleGroupLabel}
				exerciseCount={exerciseCount}
				activeExerciseIndex={activeExerciseIndex}
			/>

			<View style={styles.series}>
				<View style={styles.serieIndicator}>
					<View style={styles.serieIndicatorLine} />
					<Text
						variant="body-small-bold"
						testID={WORKOUT_SESSION_SCREEN_TEST_IDS.SET_PROGRESS_CURRENT}>
						{`${currentSetNumber} de ${setsCount} séries`}
					</Text>
					<View style={styles.serieIndicatorLine} />
				</View>

				<ExerciseContainer hasManySets={hasManySets}>
					{sets.map((set, i) => (
						<SerieItem
							key={set.id}
							serie={i + 1}
							reps={set.reps}
							hasNext={i < sets.length - 1}
							hasManySets={hasManySets}
							completed={i < completedSets}
						/>
					))}
				</ExerciseContainer>
			</View>
		</View>
	)
}
