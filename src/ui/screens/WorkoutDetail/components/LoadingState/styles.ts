import { StyleSheet } from "react-native"
import { ThemeType, radius, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			gap: spacings.gap[16],
		},
		bannerSkeleton: {
			borderRadius: radius[16],
		},
		exercisesContainer: {
			gap: spacings.gap[8],
		},
		exerciseSkeleton: {
			borderRadius: radius[16],
		},
	})
}
