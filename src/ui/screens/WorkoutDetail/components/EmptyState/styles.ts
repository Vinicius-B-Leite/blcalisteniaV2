import { StyleSheet } from "react-native"
import { ThemeType, spacings, radius } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			gap: spacings.gap[8],
			padding: spacings.padding[16],
			borderRadius: radius[16],
			backgroundColor: theme.surface.container,
			borderWidth: 1,
			borderColor: theme.border.default,
		},
		title: {
			textAlign: "center",
			color: theme.content["text-default"],
		},
		description: {
			textAlign: "center",
			color: theme.content["text-default"],
		},
	})
}
