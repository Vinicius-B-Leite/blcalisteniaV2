import { ThemeType, spacings, radius } from "@/themes"
import { EdgeInsets } from "react-native-safe-area-context"

export const TAB_BAR_INDICATOR_SIZE = 55
export const TAB_GAP = spacings.gap[12]

export const createStyles = (theme: ThemeType, insets: EdgeInsets) => ({
	container: {
		position: "absolute" as const,
		bottom: Math.max(insets.bottom, spacings.padding[20]),
		left: 0,
		right: 0,
		alignItems: "center" as const,
	},
	tabBar: {
		flexDirection: "row" as const,
		backgroundColor: theme.surface.container,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: theme.border.default,
		paddingHorizontal: spacings.padding[12],
		paddingVertical: spacings.padding[12],
		gap: TAB_GAP,
		alignItems: "center" as const,
		position: "relative" as const,
	},
	activeIndicator: {
		position: "absolute" as const,
		width: TAB_BAR_INDICATOR_SIZE,
		height: TAB_BAR_INDICATOR_SIZE,
		borderRadius: radius.full,
		backgroundColor: theme.action["brand-background"],
		left: spacings.padding[12],
		zIndex: 1,
	},
	tabButton: {
		width: TAB_BAR_INDICATOR_SIZE,
		height: TAB_BAR_INDICATOR_SIZE,
		borderRadius: radius.full,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		backgroundColor: theme.surface.background,
		borderWidth: 1,
		borderColor: theme.border.default,
		zIndex: 10,
	},
	tabButtonActive: {
		backgroundColor: "transparent",
		borderColor: "transparent",
	},
})
