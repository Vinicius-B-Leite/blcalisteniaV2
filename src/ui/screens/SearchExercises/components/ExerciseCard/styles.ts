import { StyleSheet } from "react-native"
import { ThemeType } from "@/themes/types"
import { spacings } from "@/themes/tokens/spacings"
import { radius } from "@/themes/tokens/sizes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			gap: 41,
			padding: spacings.padding[8],
			backgroundColor: theme.surface.container,
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
			borderRadius: radius[16],
		},
		content: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[12],
			flex: 1,
		},
		image: {
			width: 90,
			height: 50,
			borderRadius: 11,
			borderWidth: 2.6,
			borderColor: theme.surface.container,
		},
		textContainer: {
			flex: 1,
			justifyContent: "center",
			gap: spacings.gap[4],
		},
		iconButton: {
			borderWidth: 1,
			borderColor: theme.border.default,
			padding: spacings.padding[8],
			justifyContent: "center",
			alignItems: "center",
			borderRadius: radius.full,
		},
	})
}
