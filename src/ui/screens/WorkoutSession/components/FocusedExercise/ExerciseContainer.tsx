import { ScrollView, View } from "react-native"
import { useAppTheme } from "@/themes/hooks"
import { stylesTheme } from "./styles"
import { ExerciseContainerProps } from "./types"

export const ExerciseContainer = ({
	hasManySets,
	children,
}: ExerciseContainerProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	if (hasManySets) {
		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.exerciseContainerScroll}>
				{children}
			</ScrollView>
		)
	}

	return <View style={styles.exerciseContainerRow}>{children}</View>
}
