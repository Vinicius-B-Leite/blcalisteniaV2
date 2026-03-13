import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		root: {
			marginBottom: spacings.margin[24],
			marginTop: spacings.margin[8],
		},
	})
}
