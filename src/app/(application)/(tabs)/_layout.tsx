import { Tabs } from "expo-router"
//TODO: alterar o nome de container -> molecules
import { TabBar } from "@/components/molecules"

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
