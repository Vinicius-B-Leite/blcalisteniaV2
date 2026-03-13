import { Redirect, Stack } from "expo-router"
import { useAuth } from "@/domains/Auth"

export default function ProtectedLayout() {
	const { auth } = useAuth()

	if (!auth?.id) {
		return <Redirect href="/" />
	}

	return (
		<Stack screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}>
			<Stack.Screen options={{ headerShown: false }} name="(tabs)" />
			<Stack.Screen options={{ headerShown: false }} name="workout" />
		</Stack>
	)
}
