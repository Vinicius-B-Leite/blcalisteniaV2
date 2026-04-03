import { StyleSheet } from "react-native"
import { ThemeType } from "@/themes/types"
import { spacings, radius } from "@/themes/tokens"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: spacings.gap[8],
		},
		chip: {
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[20],
			borderRadius: radius[8],
			backgroundColor: theme.surface.background,
		},
		chipSelected: {
			backgroundColor: theme.surface["brand-opacity-20"],
		},
		chipTextSelected: {
			color: theme.content["text-brand"],
		},
	})
