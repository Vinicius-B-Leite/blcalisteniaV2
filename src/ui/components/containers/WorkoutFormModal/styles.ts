import { StyleSheet } from "react-native"
import { spacings } from "@/themes/tokens"
import { ThemeType } from "@/themes/types"

export const createStyles = (theme: ThemeType) =>
	StyleSheet.create({
		buttonsWrapper: {
			gap: spacings.gap[8],
		},
		content: {
			gap: spacings.gap[16],
		},
		top: {
			gap: spacings.gap[16],
		},
		bottom: {
			gap: spacings.gap[24],
		},
		editImageWrapper: {
			alignItems: "center" as const,
		},
		editImageText: {
			color: theme.content["text-brand"],
			textDecorationLine: "underline",
		},
	})
