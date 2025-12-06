import { createContext, PropsWithChildren, useState } from "react"
import { dark } from "../tokens/colors"
import { ThemeType } from "../types"

type ThemContext = {
	theme: ThemeType
}
export const ThemeContext = createContext({} as ThemContext)

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const [theme, setTheme] = useState<ThemeType>(dark)

	return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}
