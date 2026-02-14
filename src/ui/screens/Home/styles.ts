import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"
import { EdgeInsets } from "react-native-safe-area-context"

export const stylesTheme = (theme: ThemeType, insets: EdgeInsets) =>
	StyleSheet.create({
		container: {
			flex: 1,
			gap: spacings.gap[24],
		},
	})
