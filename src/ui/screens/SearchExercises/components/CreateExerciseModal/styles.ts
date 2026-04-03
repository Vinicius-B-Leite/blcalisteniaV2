import { StyleSheet } from "react-native"
import { ThemeType } from "@/themes/types"
import { spacings, radius } from "@/themes/tokens"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		content: {
			gap: spacings.gap[16],
		},
		input: {
			borderWidth: 1,
			borderRadius: radius[12],
			padding: spacings.padding[12],
			borderColor: theme.border.default,
			backgroundColor: theme.surface.container,
		},
		buttonsContainer: {
			gap: spacings.gap[8],
		},
	})
