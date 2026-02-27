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
		daysWrapper: {
			flexDirection: "row",
			width: "100%",
			gap: spacings.gap[4],
		},
		dayButton: {
			flex: 1,
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[20],
			borderRadius: radius[8],
			borderWidth: 1,
			backgroundColor: theme.surface.background,
			borderColor: theme.border["default-dim"],
		},
		dayButtonSelected: {
			backgroundColor: theme.surface["brand-opacity-20"],
			borderColor: "transparent",
		},
		dayText: {
			color: theme.content["text-variant"],
			textAlign: "center",
		},
		dayTextSelected: {
			color: theme.content["text-brand"],
		},
	})
