import { Tabs } from "expo-router"
import { TabBar } from "@/components/molecules"

const TabLayout = () => {
	return (
		<Tabs
			tabBar={(props) => <TabBar {...props} />}
			screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="home" />
			<Tabs.Screen name="workout" />
			<Tabs.Screen name="profile" />
		</Tabs>
	)
}

export default TabLayout
