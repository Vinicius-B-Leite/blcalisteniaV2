import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		addButton: {
			alignSelf: "center",
			marginTop: spacings.margin[24],
		},
		addButtonText: {
			color: theme.content["text-brand"],
		},
		itemSeparator: {
			height: spacings.gap[12],
		},
	})
}
