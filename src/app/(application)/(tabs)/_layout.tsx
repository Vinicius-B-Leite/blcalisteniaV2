import { Tabs } from "expo-router"

const TabLayout = () => {
	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="home" />
		</Tabs>
	)
}

export default TabLayout
