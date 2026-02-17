import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		separator: {
			height: spacings.gap[8],
		},
		listHeader: {
			paddingBottom: spacings.margin[24],
		},
		buttonsContainer: {
			gap: spacings.gap[8],
			paddingTop: spacings.padding[16],
		},
	})
