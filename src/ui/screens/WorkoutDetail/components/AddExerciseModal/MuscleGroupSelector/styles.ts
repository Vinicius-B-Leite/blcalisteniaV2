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
		groupsWrapper: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: spacings.gap[8],
		},
		groupButton: {
			paddingVertical: spacings.padding[8],
			paddingHorizontal: spacings.padding[12],
			borderRadius: radius[8],
			borderWidth: 1,
			backgroundColor: theme.surface.background,
			borderColor: theme.border["default-dim"],
		},
		groupButtonSelected: {
			backgroundColor: theme.surface["brand-opacity-20"],
			borderColor: "transparent",
		},
		groupText: {
			color: theme.content["text-variant"],
		},
		groupTextSelected: {
			color: theme.content["text-brand"],
		},
	})
