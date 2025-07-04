import { useRouter } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}

export default function Page() {
	const router = useRouter()
	return (
		<View style={styles.container}>
			<View style={styles.main}>
				<Text style={styles.title} onPress={() => router.navigate("/profile")}>
					Hello World
				</Text>
				<Text style={styles.subtitle}>This is the first page of your app.</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 24,
		backgroundColor: "#000",
	},
	main: {
		flex: 1,
		justifyContent: "center",
		maxWidth: 960,
		marginHorizontal: "auto",
	},
	title: {
		fontSize: 64,
		fontWeight: "bold",
		color: "#fff",
	},
	subtitle: {
		fontSize: 36,
		color: "#38434D",
	},
})
