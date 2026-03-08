import { Skeleton } from "@/components/core"
import { useStyles } from "@/themes"
import { View } from "react-native"
import { stylesTheme } from "./styles"

export const LoadingState = () => {
	const styles = useStyles(stylesTheme)

	return (
		<View style={styles.container}>
			<Skeleton style={[styles.skeleton, styles.skeletonSmall]} />
			<Skeleton style={[styles.skeleton, styles.skeletonLarge]} />
			<Skeleton style={[styles.skeleton, styles.skeletonLarge]} />
			<Skeleton style={[styles.skeleton, styles.skeletonLarge]} />
		</View>
	)
}
