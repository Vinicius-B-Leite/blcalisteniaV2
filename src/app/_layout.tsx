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
import { useFonts } from "expo-font"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}

const Routes = () => {
	const [loaded] = useFonts({
		"Inter-Black": require("../assets/fonts/inter/Inter_18pt-Black.ttf"),
		"Inter-BlackItalic": require("../assets/fonts/inter/Inter_18pt-BlackItalic.ttf"),
		"Inter-Bold": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
		"Inter-BoldItalic": require("../assets/fonts/inter/Inter_18pt-BoldItalic.ttf"),
		"Inter-ExtraBold": require("../assets/fonts/inter/Inter_18pt-ExtraBold.ttf"),
		"Inter-ExtraBoldItalic": require("../assets/fonts/inter/Inter_18pt-ExtraBoldItalic.ttf"),
		"Inter-ExtraLight": require("../assets/fonts/inter/Inter_18pt-ExtraLight.ttf"),
		"Inter-ExtraLightItalic": require("../assets/fonts/inter/Inter_18pt-ExtraLightItalic.ttf"),
		"Inter-Italic": require("../assets/fonts/inter/Inter_18pt-Italic.ttf"),
		"Inter-Light": require("../assets/fonts/inter/Inter_18pt-Light.ttf"),
		"Inter-LightItalic": require("../assets/fonts/inter/Inter_18pt-LightItalic.ttf"),
		"Inter-Medium": require("../assets/fonts/inter/Inter_18pt-Medium.ttf"),
		"Inter-MediumItalic": require("../assets/fonts/inter/Inter_18pt-MediumItalic.ttf"),
		"Inter-Regular": require("../assets/fonts/inter/Inter_18pt-Regular.ttf"),
		"Inter-SemiBold": require("../assets/fonts/inter/Inter_18pt-SemiBold.ttf"),
		"Inter-SemiBoldItalic": require("../assets/fonts/inter/Inter_18pt-SemiBoldItalic.ttf"),
		"Inter-Thin": require("../assets/fonts/inter/Inter_18pt-Thin.ttf"),
		"Inter-ThinItalic": require("../assets/fonts/inter/Inter_18pt-ThinItalic.ttf"),
	})
	const { auth, isLoadingAuth } = useAuth()
	const { isSeeding } = useDatabaseSeed()

	useEffect(() => {
		SplashScreen.preventAutoHideAsync()
	}, [])

	useEffect(() => {
		if (!isLoadingAuth && !isSeeding && loaded) {
			SplashScreen.hide()
		}
	}, [isLoadingAuth, isSeeding, loaded])

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
