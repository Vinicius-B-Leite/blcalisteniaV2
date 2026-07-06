import { View } from "react-native"
import { Text } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { stylesTheme } from "./styles"
import { SummaryProps } from "./types"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../../constants"

export const Summary = ({
	exerciseName,
	muscleGroupLabel,
	exerciseCount,
	activeExerciseIndex,
}: SummaryProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	const isActive = (index: number) => index === activeExerciseIndex

	return (
		<>
			<View style={styles.summary}>
				<View style={styles.exerciseName}>
					<Text
						variant="title-large-bold"
						style={styles.exerciseNameText}
						testID={WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_NAME}>
						{exerciseName}
					</Text>
				</View>

				<View style={styles.musclesGroup}>
					<Text variant="title-small-bold" style={styles.musclesGroupLabel}>
						Grupo muscular
					</Text>
					<Text
						variant="body-large-regular"
						style={styles.musclesGroupValue}
						numberOfLines={2}
						testID={WORKOUT_SESSION_SCREEN_TEST_IDS.MUSCLE_GROUP}>
						{muscleGroupLabel}
					</Text>
				</View>
			</View>

			<View style={styles.exerciseCountIndicators}>
				{[...Array(exerciseCount)].map((_, i) => (
					<View
						key={i}
						testID={WORKOUT_SESSION_SCREEN_TEST_IDS.EXERCISE_INDICATOR}
						style={[
							styles.exerciseCountIndicatorItem,
							isActive(i)
								? styles.exerciseCountIndicatorItemActive
								: styles.exerciseCountIndicatorItemInactive,
						]}
					/>
				))}
			</View>
		</>
	)
}
