import { StyleSheet } from "react-native"
import { ThemeType, spacings, radius } from "@/themes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			gap: spacings.gap[8],
		},
		chip: {
			justifyContent: "center",
			alignItems: "stretch",
			gap: spacings.gap[8],
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[12],
			backgroundColor: theme.surface["brand-opacity-20"],
			borderRadius: radius[8],
			marginTop: spacings.margin[8],
		},
		chipSelected: {
			backgroundColor: theme.surface.brand,
		},
		chipText: {
			textAlign: "center",
			color: theme.surface.brand,
		},
		chipTextSelected: {
			color: theme.content["always-white"],
		},
	})
}
