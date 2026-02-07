import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme"
import { spacings } from "../../../../theme/tokens/spacings"
import { radius } from "../../../../theme/tokens/sizes"

export const styleTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			gap: spacings.gap[12],
			padding: spacings.padding[12],
			borderRadius: radius[16],
			backgroundColor: theme.surface["brand-opacity-10"],
		},
		weekDaysContainer: {
			gap: spacings.gap[4],
			marginTop: spacings.margin[12],
		},
		weekDayItemContainer: {
			alignItems: "center",
			gap: spacings.gap[16],
			backgroundColor: theme.surface["background"],
			paddingVertical: spacings.padding[8],
			paddingHorizontal: spacings.padding[8],
			borderRadius: radius[24],
		},
		weekDayItemContainerActive: {
			backgroundColor: theme.surface["brand"],
		},
		weekDayItemNumber: {
			borderRadius: radius.full,
			borderColor: theme.border.default,
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[12],
			borderWidth: 1,
			borderStyle: "solid",
			backgroundColor: theme.surface.container,
		},
		optionsContainer: {
			flexDirection: "row",
			gap: spacings.gap[12],
		},
		optionItemContainer: {
			flex: 1,
			paddingVertical: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
			gap: spacings.gap[8],
			backgroundColor: theme.surface.background,
			borderRadius: radius[16],
			alignItems: "center",
		},
		optionItemIconContainer: {
			borderRadius: radius.full,
			borderColor: theme.border.default,
			paddingVertical: spacings.padding[12],
			paddingHorizontal: spacings.padding[12],
			borderWidth: 1,
			borderStyle: "solid",
			backgroundColor: theme.surface.container,
		},
	})
