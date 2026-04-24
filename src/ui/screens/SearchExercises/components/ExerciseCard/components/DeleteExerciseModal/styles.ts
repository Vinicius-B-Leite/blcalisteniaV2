import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		content: {
			gap: spacings.gap[24],
		},
		message: {
			textAlign: "center",
			color: theme.content["text-default"],
		},
		buttonsContainer: {
			gap: spacings.gap[12],
			marginTop: spacings.margin[12],
		},
	})
}
