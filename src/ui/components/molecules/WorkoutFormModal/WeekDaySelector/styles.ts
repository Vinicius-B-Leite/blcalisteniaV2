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
			gap: spacings.gap[4],
		},
		dayButton: {
			flex: 1,
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[20],
			borderRadius: radius[8],
			backgroundColor: theme.surface.background,
		},
		dayButtonSelected: {
			backgroundColor: theme.surface["brand-opacity-20"],
		},
		dayText: {
			color: theme.content["text-variant"],
			textAlign: "center",
		},
		dayTextSelected: {
			color: theme.content["text-brand"],
		},
	})
