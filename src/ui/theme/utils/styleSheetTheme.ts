import { ThemeType } from "../types"

import { StyleSheet } from "react-native"

export const styleSheetTheme = (theme: ThemeType) =>
	StyleSheet.create({
		container: {
			backgroundColor: theme.surface.background,
		},
	})
