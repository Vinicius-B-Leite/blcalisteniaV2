import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "@/themes"
import { AuthProvider } from "../domain/auth/AuthContext"
import { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react-native"

export const customRender = (children: ReactElement, options?: RenderOptions) => {
	return render(
		<ThemeProvider>
			<SafeAreaProvider>
				<AuthProvider>{children}</AuthProvider>
			</SafeAreaProvider>
		</ThemeProvider>,
		options,
	)
}
