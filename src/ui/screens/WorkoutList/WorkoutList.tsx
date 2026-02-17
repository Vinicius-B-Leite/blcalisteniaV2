import { View, FlatList } from "react-native"
import { Header, Screen, Text, Pressable } from "@/components/core"
import {
	CreateWorkoutModal,
	EmptyState,
	WorkoutCard,
	SearchBar,
	DeleteWorkoutModal,
} from "./components"
import { useWorkoutList } from "./useWorkoutList"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"

export const WorkoutList = () => {
	const { states, actions } = useWorkoutList()
	const styles = useStyles(stylesTheme)

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Meus treinos</Header.VerticalCenterTitle>
			</Header.Root>

			{!states.hasWorkouts ? (
				<EmptyState handleOpenModal={actions.openModal} />
			) : (
				<FlatList
					data={states.workouts}
					keyExtractor={(item) => item.id}
					ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
					ListHeaderComponent={
						<SearchBar
							value={states.searchText}
							onChangeText={actions.onSearchTextChange}
						/>
					}
					ListFooterComponent={
						<Pressable.Root
							onPress={actions.openModal}
							style={styles.addButton}>
							<Text variant="body-large-bold" style={styles.addButtonText}>
								Adicionar treino
							</Text>
						</Pressable.Root>
					}
					renderItem={({ item }) => (
						<WorkoutCard
							id={item.id}
							title={item.title}
							exerciseCount={item.exerciseCount}
							category={item.category}
							imageUrl={item.imageUrl}
							onEdit={() => actions.onEditWorkout(item.id)}
							onDelete={() => actions.onDeleteWorkout(item.id)}
						/>
					)}
				/>
			)}

			<CreateWorkoutModal
				visible={states.modalCreateWorkout}
				onClose={actions.closeModal}
			/>

			<DeleteWorkoutModal
				visible={states.deleteModal !== null}
				workoutName={states.deleteModal?.title || ""}
				onClose={actions.onCloseDeleteModal}
				onConfirm={actions.onConfirmDelete}
			/>
		</Screen>
	)
}
