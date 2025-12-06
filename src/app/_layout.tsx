import { Stack } from "expo-router"
import { ThemeProvider } from "../ui/theme/provider/themeProvider"
import { SafeAreaProvider } from "react-native-safe-area-context"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}

const RootLayout = () => {
	return (
		<ThemeProvider>
			<SafeAreaProvider>
				<Stack>
					<Stack.Screen
						name="index"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
			</SafeAreaProvider>
		</ThemeProvider>
	)
}

export default RootLayout
