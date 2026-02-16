import { StyleSheet } from "react-native"
import { spacings, ThemeType } from "@/themes/tokens"
import { radius } from "@/themes/tokens"
import { EdgeInsets } from "react-native-safe-area-context"

export const createStyles = (theme: ThemeType, bottom: number = 0) =>
	StyleSheet.create({
		overlay: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			justifyContent: "flex-end",
		},
		container: {
			backgroundColor: theme.surface.background,
			borderTopLeftRadius: radius[16],
			borderTopRightRadius: radius[16],
			paddingTop: spacings.padding[20],
			paddingHorizontal: spacings.padding[20],
			gap: spacings.gap[16],
			paddingBottom: bottom + spacings.padding[16],
		},
		header: {
			flexDirection: "row-reverse",
			justifyContent: "space-between",
			alignItems: "center",
		},
		title: {
			textAlign: "center",
		},
		contentWrapper: {
			borderRadius: radius[16],
			paddingVertical: spacings.padding[16],
			paddingHorizontal: spacings.padding[16],
			backgroundColor: theme.surface.container,
			borderWidth: 1,
			borderColor: theme.border.default,
		},
	})
