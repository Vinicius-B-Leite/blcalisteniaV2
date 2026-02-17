import { StyleSheet } from "react-native"
import { ThemeType } from "@/themes/types"
import { radius, spacings } from "@/themes/tokens"

export const createStyles = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			gap: spacings.gap[8],
		},
		label: {
			color: theme.content["text-default"],
		},
		typesWrapper: {
			gap: spacings.gap[4],
			width: "100%",
			flexDirection: "row",
		},
		typeButton: {
			flex: 1,
			width: "100%",
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[12],
			borderRadius: radius[8],
			borderWidth: 1,
			backgroundColor: theme.surface.background,
			borderColor: theme.border["default-dim"],
		},
		typeButtonSelected: {
			backgroundColor: theme.surface["brand-opacity-20"],
			borderColor: "transparent",
		},
		typeText: {
			color: theme.content["text-variant"],
			textAlign: "center",
		},
		typeTextSelected: {
			color: theme.content["text-brand"],
		},
	})
