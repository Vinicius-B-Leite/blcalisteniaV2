import { Dimensions, StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme"
import { radius } from "../../../../theme/tokens/sizes"
import { spacings } from "../../../../theme/tokens/spacings"

const SCREEN_WIDTH = Dimensions.get("window").width
const CARD_WIDTH = SCREEN_WIDTH * 0.75

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: { flex: 1, gap: spacings.gap[16] },
		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		cardsContainer: {
			flexDirection: "row",
			gap: spacings.gap[16],
		},
		bannerCardImg: {
			width: CARD_WIDTH,
			aspectRatio: 16 / 9,
			borderRadius: radius[16],
			overflow: "hidden",
		},
		overlay: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-end",
			backgroundColor: "rgba(0, 0, 0, 0.1)",
			paddingVertical: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
		},
		textContainer: {
			flex: 1,
		},
		navButton: {
			paddingHorizontal: spacings.padding[8],
			paddingVertical: spacings.padding[8],
			borderRadius: radius.full,
			backgroundColor: theme.action["brand-background"],
			alignItems: "center",
			justifyContent: "center",
		},
	})
