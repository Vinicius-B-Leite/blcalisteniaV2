import { StyleSheet } from "react-native"
import { ThemeType, spacings, radius } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			gap: spacings.gap[12],
		},
		skeleton: {
			borderRadius: radius[16],
		},
		skeletonSmall: {
			height: 50,
		},
		skeletonLarge: {
			height: 100,
		},
	})
}
