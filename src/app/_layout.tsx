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
import { useEffect } from "react"
import { useDatabaseSeed } from "@/infra/database"
import { AddWorkoutExerciseProvider } from "src/providers/addWorkoutExercise"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}

const Routes = () => {
	const { auth, isLoadingAuth } = useAuth()
	const { execute, isSeeding } = useDatabaseSeed()

	useEffect(() => {
		SplashScreen.preventAutoHideAsync()
	}, [])

	useEffect(() => {
		if (!isLoadingAuth && !isSeeding) {
			SplashScreen.hide()
		}
	}, [isLoadingAuth, isSeeding])

	if (isLoadingAuth || isSeeding) {
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

const RootLayout = () => {
	return (
		<QueryCacheProvider value={QueryCacheService}>
			<ThemeProvider>
				<SafeAreaProvider>
					<ReposProviders>
						<ImageStorageProvider value={ImageStorageService}>
							<AuthProvider>
								<AddWorkoutExerciseProvider>
									<Routes />
								</AddWorkoutExerciseProvider>
							</AuthProvider>
						</ImageStorageProvider>
					</ReposProviders>
				</SafeAreaProvider>
			</ThemeProvider>
		</QueryCacheProvider>
	)
}

export default RootLayout
