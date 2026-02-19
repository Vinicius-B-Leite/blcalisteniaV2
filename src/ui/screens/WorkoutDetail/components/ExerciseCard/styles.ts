import { StyleSheet } from "react-native"
import { ThemeType, spacings, radius } from "@/themes"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			padding: spacings.padding[8],
			backgroundColor: theme.surface.container,
			borderRadius: radius[16],
			borderWidth: 1,
			borderColor: theme.border.default,
		},
		contentContainer: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[12],
			flex: 1,
		},
		image: {
			width: "30%",
			aspectRatio: 2,
			alignSelf: "stretch",
			borderRadius: radius[12],
			borderColor: theme.surface.container,
		},
		textContainer: {
			flexDirection: "column",
			justifyContent: "center",
			gap: spacings.gap[4],
			flex: 1,
		},
		title: {
			color: theme.content["text-default"],
		},
		subtitle: {
			color: theme.content["text-default"],
		},
		actionsContainer: {
			flexDirection: "row",
			gap: spacings.gap[8],
			alignItems: "center",
		},
		actionButton: {
			width: 40,
			height: 40,
			borderRadius: radius.full,
			backgroundColor: theme.surface.background,
			borderWidth: 0.73,
			borderColor: theme.border.default,
			justifyContent: "center",
			alignItems: "center",
		},
	})
