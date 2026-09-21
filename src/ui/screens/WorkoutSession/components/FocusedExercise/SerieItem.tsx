import { Animated, View } from "react-native"
import { Icon, Text } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { stylesTheme } from "./styles"
import { SerieItemProps } from "./types"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../../constants"
import { useSerieItem } from "./useSerieItem"

export const SerieItem = ({
	serie,
	reps,
	hasNext = true,
	hasManySets,
	completed,
}: SerieItemProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)
	const { states } = useSerieItem(completed)

	return (
		<View
			style={[styles.serieItem, hasNext && { flex: 1 }]}
			testID={WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM}>
			<View style={styles.serieItem2}>
				<Animated.View
					style={[
						styles.serieItemNumber,
						{
							backgroundColor: states.backgroundColor,
							borderColor: states.borderColor,
						},
					]}>
					{completed ? (
						<Animated.View style={{ transform: [{ scale: states.checkScale }] }}>
							<Icon
								name="check"
								size={16}
								variant="onBrand"
								testID={WORKOUT_SESSION_SCREEN_TEST_IDS.SET_ITEM_COMPLETED}
							/>
						</Animated.View>
					) : (
						<Text variant="body-small-bold">{serie}</Text>
					)}
				</Animated.View>
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
