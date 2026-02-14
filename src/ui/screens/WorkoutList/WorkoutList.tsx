import { View } from "react-native"
import { Header } from "../../components/core/Header"
import { Screen } from "../../components/core/Screen/Screen"
import { EmptyState } from "./components"

export const WorkoutList = () => {
	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Meus treinos</Header.VerticalCenterTitle>
			</Header.Root>

			<EmptyState />
		</Screen>
	)
}
