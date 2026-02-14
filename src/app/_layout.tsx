import { Stack } from "expo-router"
import { ThemeProvider } from "@/themes"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider, useAuth } from "../domain/auth/AuthContext"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}

const Routes = () => {
	const { auth } = useAuth()

	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Protected guard={!!auth?.id}>
				<Stack.Screen options={{ headerShown: false }} name="(application)" />
			</Stack.Protected>
		</Stack>
	)
}

const RootLayout = () => {
	return (
		<ThemeProvider>
			<SafeAreaProvider>
				<AuthProvider>
					<Routes />
				</AuthProvider>
			</SafeAreaProvider>
		</ThemeProvider>
	)
}

export default RootLayout
