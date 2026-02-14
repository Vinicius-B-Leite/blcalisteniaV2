import { StyleSheet, Dimensions } from "react-native"
import { ThemeType, spacings, radius } from "@/themes"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			alignItems: "center",
			gap: spacings.gap[16],
		},
		content: {
			alignItems: "center",
			gap: spacings.gap[24],
			width: "100%",
			paddingHorizontal: spacings.padding[16],
		},
		imagesContainer: {
			width: "100%",
			height: Dimensions.get("window").width * 0.6,
			position: "relative",
		},
		image: {
			position: "absolute",
			width: 180,
			height: 90,
			borderRadius: radius[16],
			borderWidth: 4,
			borderColor: theme.surface.container,
		},
		image1: {
			bottom: 90,
			left: 100,
			zIndex: 10,
		},
		image2: {
			bottom: 30,
			left: 0,
			zIndex: 20,
		},
		image3: {
			bottom: 0,
			left: 150,
			zIndex: 30,
		},
		title: {
			textAlign: "center",
		},
		footer: {
			gap: spacings.gap[32],
		},
		description: {
			textAlign: "left",
		},
		buttonsContainer: {
			gap: spacings.gap[8],
		},
	})
