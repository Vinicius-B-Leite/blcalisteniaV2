import { View } from "react-native"
import { Screen, Text } from "@/components/core"

const Profile = () => {
	return (
		<Screen>
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Text variant="body-large-bold">Perfil</Text>
			</View>
		</Screen>
	)
}

export default Profile
