import { View } from "react-native"
import { Screen } from "../../../ui/components/core/Screen/Screen"
import { Text } from "../../../ui/components/core/Text"

const Workout = () => {
	return (
		<Screen>
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Text variant="body-large-bold">Treino</Text>
			</View>
		</Screen>
	)
}

export default Workout
