import { StyleSheet } from "react-native"
import { ThemeType } from "../../theme"
import { spacings } from "../../theme/tokens/spacings"
import { EdgeInsets } from "react-native-safe-area-context"

export const stylesTheme = (theme: ThemeType, insets: EdgeInsets) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingBottom:
				Math.max(insets.bottom, spacings.padding[20]) + spacings.padding[20],
		},
	})
