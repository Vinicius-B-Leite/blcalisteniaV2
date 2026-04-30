import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		buttonsContainer: {
			gap: spacings.gap[12],
			marginTop: spacings.margin[12],
		},
	})
}
