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
			paddingHorizontal: spacings.padding[4],
			//TODO: verificar se é necessário um width fixo ou se pode ser dinâmico
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
