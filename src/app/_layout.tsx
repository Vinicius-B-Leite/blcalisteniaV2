import { Stack } from "expo-router"
import { ThemeProvider } from "@/themes"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider, useAuth } from "@/domains/Auth"
import { ReposProviders } from "src/infra/repos"
import {
	ImageStorageProvider,
	ImageStorageService,
	QueryCacheProvider,
	QueryCacheService,
} from "@/infra/services"
import * as SplashScreen from "expo-splash-screen"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}
SplashScreen.preventAutoHideAsync()

const Routes = () => {
	const { auth, isLoadingAuth } = useAuth()

	if (isLoadingAuth) {
		return null
	}

	if (!isLoadingAuth) {
		SplashScreen.hide()
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

const RootLayout = () => {
	return (
		<QueryCacheProvider value={QueryCacheService}>
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
		</QueryCacheProvider>
	)
}

export default RootLayout
