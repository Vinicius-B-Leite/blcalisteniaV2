import { StyleSheet } from "react-native"
import { ThemeType } from "../../../../theme/types"
import { spacings } from "../../../../theme/tokens/spacings"

export const stylesTheme = (theme: ThemeType) => {
	return StyleSheet.create({
		root: {
			marginBottom: spacings.margin[24],
			marginTop: spacings.margin[8],
		},
	})
}
