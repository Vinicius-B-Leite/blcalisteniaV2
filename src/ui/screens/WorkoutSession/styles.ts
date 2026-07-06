import { spacings } from "@/themes/tokens"
import { ThemeType } from "@/themes/types"
import { StyleSheet } from "react-native"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		sessionTimer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: spacings.gap[12],
			marginBottom: spacings.margin[16],
		},

		sessionTimerLabel: {
			textAlign: "left",
		},
		sessionTimerValue: {
			textAlign: "right",
			color: theme.content["text-brand"],
		},
	})
