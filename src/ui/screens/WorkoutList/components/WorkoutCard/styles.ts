import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme/types"
import { spacings } from "../../../../theme/tokens/spacings"
import { radius } from "../../../../theme/tokens/sizes"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			gap: spacings.gap[32],
			padding: spacings.padding[8],
			backgroundColor: theme.surface.container,
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
			borderRadius: radius[16],
		},
		contentContainer: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[12],
			flex: 1,
		},
		image: {
			width: "40%",
			alignSelf: "stretch",
			borderRadius: radius[8],
		},
		infoContainer: {
			flex: 1,
			justifyContent: "center",
			gap: spacings.gap[4],
		},
		title: {
			color: theme.content["always-white"],
		},
		subtitle: {
			color: theme.content["always-white"],
		},
		actionsContainer: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[8],
		},
		iconButton: {
			padding: spacings.padding[8],
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.surface.container2,
			borderRadius: radius.full,
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
		},
	})
}
