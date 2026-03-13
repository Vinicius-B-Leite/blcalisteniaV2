import { Stack } from "expo-router"
import { ThemeProvider } from "@/themes"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider, useAuth } from "@/domains/Auth"
import { ReposProviders } from "src/infra/repos"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ImageStorageProvider, ImageStorageService } from "@/infra/services"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}

const Routes = () => {
	const { auth, isLoadingAuth } = useAuth()

	if (isLoadingAuth) {
		//TODO: adicionar loading screen ou splash screen
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
						<ImageStorageProvider value={ImageStorageService}>
							<AuthProvider>
								<Routes />
							</AuthProvider>
						</ImageStorageProvider>
					</ReposProviders>
				</SafeAreaProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default RootLayout
