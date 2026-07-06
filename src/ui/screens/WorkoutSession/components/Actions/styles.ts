import { radius, spacings } from "@/themes/tokens"
import { ThemeType } from "@/themes/types"
import { StyleSheet } from "react-native"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		actions: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: spacings.gap[12],
			width: "100%",
			marginVertical: spacings.margin[16],
		},

		actionsButton: {
			flexDirection: "column",
			gap: spacings.gap[8],
			borderRadius: radius[16],
			backgroundColor: theme.surface.container,
			flex: 1,
			paddingVertical: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
			justifyContent: "center",
			alignItems: "center",
		},

		actionButtonIcon: {
			backgroundColor: theme.surface.background,
			borderWidth: 1,
			borderColor: theme.border.default,
			borderRadius: radius.full,
			justifyContent: "center",
			alignItems: "center",
			padding: spacings.padding[16],
		},

		actionButtonText: {
			color: theme.content["text-default"],
			textAlign: "center",
		},

		actionButtonTextInactive: {
			color: theme.content["text-variant"],
		},
	})
