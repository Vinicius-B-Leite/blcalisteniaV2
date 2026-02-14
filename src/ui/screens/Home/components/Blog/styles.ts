import { StyleSheet } from "react-native"
import { ThemeType, spacings, radius } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			gap: spacings.gap[12],
		},
		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			gap: spacings.gap[16],
		},
		scrollContainer: {
			gap: spacings.gap[8],
		},
		card: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[8],
			padding: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
			width: "100%",
			backgroundColor: theme.surface.container,
			borderRadius: radius[16],
		},
		cardContent: {
			flex: 1,
			gap: spacings.gap[8],
		},
		textContainer: {
			gap: spacings.gap[2],
		},
		statsContainer: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[4],
		},
		statBadge: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[4],
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[8],
			backgroundColor: theme.surface.container2,
			borderRadius: radius["full"],
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
		},
		thumbnail: {
			width: 70,
			height: 90,
			backgroundColor: theme.surface.container2,
			borderRadius: radius[16],
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
			justifyContent: "center",
			alignItems: "center",
		},
	})
}
