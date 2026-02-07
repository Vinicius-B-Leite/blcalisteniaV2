import { useMemo } from "react"
import { StyleSheet } from "react-native"
import { useAppTheme } from "./useAppTheme"

export function useStyles<T extends StyleSheet.NamedStyles<T>>(
	stylesFn: (theme: ReturnType<typeof useAppTheme>["theme"]) => T
) {
	const { theme } = useAppTheme()

	return useMemo(() => {
		return StyleSheet.create(stylesFn(theme))
	}, [theme, stylesFn])
}
