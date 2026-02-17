import { StyleSheet } from "react-native"
import { ThemeType, spacings } from "@/themes"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		content: {
			gap: spacings.gap[16],
			paddingBottom: spacings.padding[20],
			paddingTop: spacings.padding[8],
		},
		exercisesSection: {
			gap: spacings.gap[8],
		},
		customExercisesSection: {
			gap: spacings.gap[16],
		},
		exercisesList: {
			gap: spacings.gap[8],
		},
		addButtonContainer: {
			paddingTop: spacings.padding[16],
		},
	})
