import { Tabs } from "expo-router"
import { TabBar } from "@/components/containers"

const TabLayout = () => {
	return (
		<Tabs
			tabBar={(props) => <TabBar {...props} />}
			screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="home" />
			<Tabs.Screen name="workout" />
		</Tabs>
	)
}

export default TabLayout
