import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme"
import { spacings } from "../../../../theme/tokens/spacings"
import { radius } from "../../../../theme/tokens/sizes"

const AVATAR_SIZE = 48

export const stylesTheme = (theme: ThemeType) =>
	StyleSheet.create({
		row: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: spacings.padding[8],
		},
		leftContent: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: spacings.padding[12],
			flex: 1,
		},
		avatarContainer: {
			width: AVATAR_SIZE,
			height: AVATAR_SIZE,
			borderRadius: AVATAR_SIZE / 2,
			overflow: "hidden",
			backgroundColor: theme.action["brand-primary"],
		},
		avatar: {
			width: AVATAR_SIZE,
			height: AVATAR_SIZE,
		},
		textContainer: {
			flexDirection: "column",
			gap: spacings.padding[4],
		},
		bellButton: {
			padding: spacings.padding[12],
			borderRadius: radius["full"],
			borderColor: theme.border.default,
			borderWidth: 1,
			borderStyle: "solid",
		},
		bellButtonPressed: {
			opacity: 0.7,
		},
	})
