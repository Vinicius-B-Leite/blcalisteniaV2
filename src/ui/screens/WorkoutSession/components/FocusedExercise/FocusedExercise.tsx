import { useAppTheme } from "@/themes/hooks"
import { View } from "react-native"
import { stylesTheme } from "./styles"
import { Text } from "@/components/core"
import { FocusedExerciseProps } from "./types"
import { Summary } from "./Summary"
import { SerieItem } from "./SerieItem"
import { ExerciseContainer } from "./ExerciseContainer"

export const FocusedExercise = ({
	exerciseName,
	muscleGroupLabel,
	sets,
	exerciseCount,
}: FocusedExerciseProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	const setsCount = sets.length
	const hasManySets = setsCount > 3
	const activeExerciseIndex = 0

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
					<Text variant="body-small-bold">1 de {setsCount} séries</Text>
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
						/>
					))}
				</ExerciseContainer>
			</View>
		</View>
	)
}
