import { Header, Screen } from "@/components/core"
import { CreateWorkoutModal, EmptyState } from "./components"
import { useWorkoutList } from "./useWorkoutList"

export const WorkoutList = () => {
	const { states, actions } = useWorkoutList()

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Meus treinos</Header.VerticalCenterTitle>
			</Header.Root>

			<EmptyState handleOpenModal={actions.openModal} />

			<CreateWorkoutModal
				visible={states.modalCreateWorkout}
				onClose={actions.closeModal}
			/>
		</Screen>
	)
}
