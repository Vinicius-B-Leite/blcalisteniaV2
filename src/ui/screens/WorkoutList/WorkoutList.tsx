import { Header, Screen } from "@/components/core"
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
