import { radius, spacings } from "@/themes/tokens"
import { ThemeType } from "@/themes/types"
import { StyleSheet } from "react-native"

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		wrapper: {},
		summary: {
			width: "100%",
			backgroundColor: theme.surface.container,
			gap: spacings.gap[8],
			padding: spacings.padding[16],
			borderRadius: radius[8],
		},

		exerciseName: {
			backgroundColor: theme.surface.background,
			paddingVertical: spacings.padding[8],
			paddingHorizontal: spacings.padding[16],
			borderRadius: radius[8],
			borderWidth: 1,
			borderColor: theme.border.default,
			justifyContent: "center",
			alignItems: "center",
		},
		exerciseNameText: {
			textAlign: "center",
		},

		musclesGroup: {
			flexDirection: "row",
			gap: spacings.gap[12],
			justifyContent: "space-between",
			alignItems: "center",
		},
		musclesGroupLabel: {
			textAlign: "left",
		},
		musclesGroupValue: {
			textAlign: "right",
		},

		exerciseCountIndicators: {
			width: "100%",
			flexDirection: "row",
			gap: spacings.gap[4],
			justifyContent: "center",
			alignItems: "center",
			marginTop: spacings.margin[8],
		},
		exerciseCountIndicatorItem: {
			height: 6,
			width: 6,
			borderRadius: radius[16],
		},
		exerciseCountIndicatorItemActive: {
			backgroundColor: theme.surface.brand,
			width: 16,
		},
		exerciseCountIndicatorItemInactive: {
			backgroundColor: theme.surface["brand-opacity-20"],
		},

		series: {
			marginTop: spacings.margin[24],
		},
		serieIndicator: {
			width: "100%",
			justifyContent: "space-between",
			alignItems: "center",
			flexDirection: "row",
			gap: spacings.gap[12],
			marginBottom: spacings.margin[24],
		},
		serieIndicatorLine: {
			height: 1,
			flex: 1,
			backgroundColor: theme.border.default,
			alignSelf: "center",
		},
		serieItem: {},
		serieItem2: {
			flexDirection: "row",
			alignItems: "center",
		},
		serieItemReps: {},
		serieItemNumber: {
			backgroundColor: theme.surface.container,
			gap: spacings.gap[4],
			justifyContent: "center",
			alignItems: "center",
			padding: spacings.padding[4],
			borderWidth: 1,
			borderColor: theme.border.default,
			borderRadius: radius.full,
			width: 32,
			height: 32,
		},
		serieItemLine: {
			height: 1,
			flex: 1,
			backgroundColor: theme.border.default,
		},
	})
