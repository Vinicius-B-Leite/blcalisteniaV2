import { StyleSheet } from "react-native"
import { ThemeType } from "@/themes/types"
import { spacings } from "@/themes/tokens/spacings"
import { radius } from "@/themes/tokens/sizes"

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
			paddingHorizontal: spacings.padding[4],
			width: 80,
			backgroundColor: theme.surface["brand-opacity-20"],
			borderRadius: radius[8],
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
