import { View } from "react-native"
import { Text } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { stylesTheme } from "./styles"
import { SerieItemProps } from "./types"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../../constants"

export const SerieItem = ({
	serie,
	reps,
	hasNext = true,
	hasManySets,
}: SerieItemProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View
			style={[styles.serieItem, hasNext && { flex: 1 }]}
			testID={WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM}>
			<View style={styles.serieItem2}>
				<View style={styles.serieItemNumber}>
					<Text variant="body-small-bold">{serie}</Text>
				</View>
				{hasNext && (
					<View style={[styles.serieItemLine, hasManySets && { width: 70 }]} />
				)}
			</View>
			<Text
				variant="body-small-bold"
				style={styles.serieItemReps}
				testID={WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_REPS}>
				{reps} reps
			</Text>
		</View>
	)
}
