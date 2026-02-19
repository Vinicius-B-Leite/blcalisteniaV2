import { radius, spacings } from "@/themes/tokens"
import { ThemeType } from "@/themes/types"
import { StyleSheet } from "react-native"

export const createStyles = (theme: ThemeType) =>
	StyleSheet.create({
		content: {
			gap: spacings.gap[16],
		},
		formSection: {
			gap: spacings.gap[16],
		},
		searchButton: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: spacings.padding[8],
			paddingHorizontal: spacings.padding[12],
			borderRadius: radius[8],
			borderWidth: 1,
			backgroundColor: theme.surface.background,
			borderColor: theme.border["default-dim"],
		},
		searchButtonText: {
			color: theme.content["text-variant"],
		},
		numberInputsRow: {
			flexDirection: "row",
			gap: spacings.gap[8],
		},
		numberInputContainer: {
			flex: 1,
			gap: spacings.gap[8],
			padding: spacings.padding[12],
			borderRadius: radius[16],
			borderWidth: 1,
			backgroundColor: theme.surface.background,
			borderColor: theme.border["default-dim"],
		},
		numberInputLabel: {
			color: theme.content["text-default"],
			textAlign: "center",
		},
		numberInputField: {
			textAlign: "center",
		},
		bottomSection: {
			gap: spacings.gap[16],
		},
		buttonsWrapper: {
			gap: spacings.gap[8],
		},
	})
