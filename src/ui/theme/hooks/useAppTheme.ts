import { useContext } from "react"
import { ThemeContext } from "@/themes"

export const useAppTheme = () => {
	const theme = useContext(ThemeContext)

	if (!theme) {
		throw new Error("useAppTheme must be used within a ThemeProvider")
	}

	return theme
}
