import { View } from "react-native"
import { Screen } from "../../../ui/components/core/Screen/Screen"
import { Text } from "../../../ui/components/core/Text"

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
