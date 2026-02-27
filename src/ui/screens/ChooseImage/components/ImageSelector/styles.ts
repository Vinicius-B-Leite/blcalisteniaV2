import { StyleSheet, Dimensions } from "react-native"
import { ThemeType } from "@/themes/types"
import { spacings } from "@/themes/tokens/spacings"
import { radius } from "@/themes/tokens/sizes"

const { width: screenWidth } = Dimensions.get("window")

const VISIBLE_ITEMS_COUNT = 2.5
const IMAGE_ASPECT_RATIO = 1.79
const HORIZONTAL_SIDES = 2

const ITEM_WIDTH =
	(screenWidth -
		spacings.padding[20] * HORIZONTAL_SIDES -
		spacings.padding[16] * HORIZONTAL_SIDES -
		spacings.gap[8]) /
	VISIBLE_ITEMS_COUNT

const ITEM_HEIGHT = ITEM_WIDTH / IMAGE_ASPECT_RATIO

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		container: {
			gap: spacings.gap[8],
			padding: spacings.padding[16],
			borderRadius: radius[16],
			backgroundColor: theme.surface.container,
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
		},
		title: {
			color: theme.content["text-default"],
		},
		scrollContainer: {
			gap: spacings.gap[8],
		},
		imageItem: {
			width: ITEM_WIDTH,
			height: ITEM_HEIGHT,
			borderRadius: radius[16],
			borderWidth: 1,
			borderColor: theme.surface.container,
			overflow: "hidden",
		},
		imageItemSelected: {
			borderColor: theme.surface.brand,
		},
		image: {
			width: "100%",
			height: "100%",
		},
		addImageItem: {
			width: ITEM_WIDTH,
			height: ITEM_HEIGHT,
			borderRadius: radius[16],
			borderWidth: 1,
			borderColor: theme.border["default-dim"],
			backgroundColor: theme.surface.background,
			justifyContent: "center",
			alignItems: "center",
		},
		addImageContent: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacings.gap[4],
		},
		addImageText: {
			color: theme.content["text-variant"],
			fontSize: 10,
			fontWeight: "500",
		},
	})
}
