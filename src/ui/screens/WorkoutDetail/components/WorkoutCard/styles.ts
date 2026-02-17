import { StyleSheet, Dimensions } from "react-native"
import { ThemeType, spacings, radius } from "@/themes"

const { height } = Dimensions.get("window")

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			width: "100%",
			height: height * 0.3,
			borderRadius: radius[16],
			overflow: "hidden",
			marginTop: spacings.margin[8],
		},
		image: {
			width: "100%",
			height: "100%",
		},
		overlay: {
			height: "100%",
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			justifyContent: "flex-end",
			padding: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
			backgroundColor: "rgba(0, 0, 0, 0.5)",
		},
		row: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
		},
		contentContainer: {
			flexDirection: "column",
			justifyContent: "center",
			gap: spacings.gap[8],
		},
		textContainer: {
			gap: spacings.gap[4],
		},
		title: {
			color: theme.content["always-white"],
		},
		subtitle: {
			color: theme.content["always-white"],
		},
		tagsContainer: {
			flexDirection: "row",
			gap: spacings.gap[8],
		},
		tag: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[12],
			borderRadius: radius[8],
			borderWidth: 1,
			borderColor: theme.border.default,
		},
		tagText: {
			color: theme.content["always-white"],
		},
		editButton: {
			borderRadius: radius.full,
			backgroundColor: theme.surface.brand,
			justifyContent: "center",
			alignItems: "center",
			padding: spacings.padding[12],
		},
	})
