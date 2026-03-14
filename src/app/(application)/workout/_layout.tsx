import { Redirect, Stack } from "expo-router"

export default function WorkoutLayout() {
	return (
		<Stack screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}>
			<Stack.Screen options={{ headerShown: false }} name="[workoutId]" />
		</Stack>
	)
}
