import { useRouter } from "expo-router"
import React from "react"
import { Text, View } from "react-native"

const Profile: React.FC = () => {
	const router = useRouter()
	return (
		<View>
			<Text style={{ color: "#fff" }} onPress={() => router.back()}>
				Profile Page
			</Text>
		</View>
	)
}

export default Profile
