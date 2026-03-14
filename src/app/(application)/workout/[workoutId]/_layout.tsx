import { Stack } from "expo-router"

export default function WorkoutDetailLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="chooseImage" />
			<Stack.Screen name="searchExercises" />
		</Stack>
	)
}
