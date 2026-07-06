import { StyleSheet } from "react-native"
import { ThemeType, radius, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			gap: spacings.gap[24],
		},
		timerRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		summaryCard: {
			backgroundColor: theme.surface.container,
			gap: spacings.gap[16],
			padding: spacings.padding[16],
			borderRadius: radius[8],
		},
		muscleRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		roundedSkeleton: {
			borderRadius: radius[8],
		},
		indicatorsContainer: {
			flexDirection: "row",
			gap: spacings.gap[4],
			justifyContent: "center",
			alignItems: "center",
		},
		indicatorSkeleton: {
			borderRadius: radius[16],
		},
		setsContainer: {
			flexDirection: "row",
			gap: spacings.gap[16],
			justifyContent: "space-between",
		},
		setSkeleton: {
			borderRadius: radius.full,
		},
	})
}
