import { Stack } from "expo-router"
import { ThemeProvider } from "@/themes"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider, useAuth } from "../domain/Auth/AuthContext"
import { ReposProviders } from "src/infra/repos"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ExpoImageService, ImageServiceProvider } from "src/infra/imageService"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}

const Routes = () => {
	const { auth, isLoadingAuth } = useAuth()

	if (isLoadingAuth) {
		return null
	}

	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Protected guard={!!auth?.id}>
				<Stack.Screen options={{ headerShown: false }} name="(application)" />
			</Stack.Protected>
		</Stack>
	)
}

const client = new QueryClient()

const RootLayout = () => {
	return (
		<QueryClientProvider client={client}>
			<ThemeProvider>
				<SafeAreaProvider>
					<ReposProviders>
						<ImageServiceProvider value={ExpoImageService}>
							<AuthProvider>
								<Routes />
							</AuthProvider>
						</ImageServiceProvider>
					</ReposProviders>
				</SafeAreaProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default RootLayout
