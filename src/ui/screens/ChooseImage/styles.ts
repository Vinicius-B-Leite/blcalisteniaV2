import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			flex: 1,
			padding: spacings.padding[20],
		},
		title: {
			marginTop: spacings.margin[8],
			marginBottom: spacings.margin[16],
		},
		content: {
			gap: spacings.gap[32],
			flex: 1,
		},
		secondTitle: {
			marginBottom: spacings.margin[8],
		},
		description: {
			marginBottom: spacings.margin[16],
		},
	})
