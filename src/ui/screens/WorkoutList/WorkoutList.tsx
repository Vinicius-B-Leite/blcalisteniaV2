import { View, FlatList } from "react-native"
import { Header, Screen, Text, Pressable, Skeleton } from "@/components/core"
import {
	EmptyState,
	WorkoutCard,
	SearchBar,
	DeleteWorkoutModal,
	LoadingState,
} from "./components"
import { useWorkoutList } from "./useWorkoutList"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { WorkoutFormModal } from "@/components/containers"

export const WorkoutList = () => {
	const { states, actions, form } = useWorkoutList()
	const styles = useStyles(stylesTheme)

	const List = () => {
		if (states.isGettingWorkouts) {
			return <LoadingState />
		}

		if (!states.hasWorkouts) {
			return <EmptyState handleOpenModal={actions.openModal} />
		}

		return (
			<FlatList
				data={states.workouts}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
				ListHeaderComponent={<SearchBar control={form.control} />}
				ListFooterComponent={
					<Pressable.Root onPress={actions.openModal} style={styles.addButton}>
						<Text variant="body-large-bold" style={styles.addButtonText}>
							Adicionar treino
						</Text>
					</Pressable.Root>
				}
				renderItem={({ item }) => (
					<WorkoutCard
						id={item.id}
						title={item.title}
						exerciseCount={5}
						category={item.category}
						imageUrl={item.imageUrl}
						onRedirect={() => actions.onOpenWorkout(item.id)}
						onDelete={() => actions.onDeleteWorkout(item.id)}
					/>
				)}
			/>
		)
	}

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Meus treinos</Header.VerticalCenterTitle>
			</Header.Root>

			<List />

			<WorkoutFormModal
				visible={states.modalCreateWorkout}
				onClose={actions.closeModal}
				title="Criar treino"
				confirmButtonText="Criar"
				onConfirm={actions.onConfirmCreateWorkout}
			/>

			<DeleteWorkoutModal
				visible={states.deleteModal !== null}
				workoutName={states.deleteModal?.title || ""}
				onClose={actions.onCloseDeleteModal}
				onConfirm={actions.onConfirmDelete}
				isLoading={states.isDeleting}
			/>
		</Screen>
	)
}
