import { Skeleton } from "@/components/core"
import { useStyles } from "@/themes"
import { View } from "react-native"
import { stylesTheme } from "./styles"
import { WORKOUT_LIST_SCREEN_TEST_IDS } from "../../constants"

export const LoadingState = () => {
	const styles = useStyles(stylesTheme)

	return (
		<View
			style={styles.container}
			testID={WORKOUT_LIST_SCREEN_TEST_IDS.LOADING_STATE}>
			<Skeleton style={[styles.skeleton, styles.skeletonLarge]} />
			<Skeleton style={[styles.skeleton, styles.skeletonLarge]} />
			<Skeleton style={[styles.skeleton, styles.skeletonLarge]} />
		</View>
	)
}
