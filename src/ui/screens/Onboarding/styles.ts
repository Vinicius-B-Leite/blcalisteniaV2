import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"
import { EdgeInsets } from "react-native-safe-area-context"

export const stylesTheme = (theme: ThemeType, insets: EdgeInsets) =>
	StyleSheet.create({
		imageBackground: {
			flex: 1,
			justifyContent: "flex-end",
		},
		linearGradient: {
			height: 300,
		},
		container: {
			gap: spacings.gap[32],
			paddingHorizontal: spacings.padding[20],
			backgroundColor: theme.surface.background,
			paddingBottom:
				Math.max(insets.bottom, spacings.padding[20]) + spacings.padding[20],
			paddingTop: spacings.padding[16],
		},
	})
