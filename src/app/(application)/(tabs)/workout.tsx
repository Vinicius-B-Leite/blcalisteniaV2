import { View } from "react-native"
import { Screen } from "../../../ui/components/core/Screen/Screen"
import { Text } from "../../../ui/components/core/Text"
import { Header } from "../../../ui/components/core/Header"

const Workout = () => {
	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Meus treinos</Header.VerticalCenterTitle>
			</Header.Root>
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Text variant="body-large-bold">Treino</Text>
			</View>
		</Screen>
	)
}

export default Workout
