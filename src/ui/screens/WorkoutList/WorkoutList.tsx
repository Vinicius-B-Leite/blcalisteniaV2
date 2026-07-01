import { View, FlatList, RefreshControl, ActivityIndicator } from "react-native"
import { Header, Screen, Text, Pressable } from "@/components/core"
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
import { WorkoutFormModal } from "@/components/molecules"
import { WORKOUT_LIST_SCREEN_TEST_IDS } from "./constants"

export const WorkoutList = () => {
	const { states, actions, form } = useWorkoutList()
	const styles = useStyles(stylesTheme)

	const List = () => {
		if (states.isGettingWorkouts) {
			return <LoadingState />
		}

		if (!states.hasWorkouts && !states.isSearching) {
			return <EmptyState handleOpenModal={actions.openModal} />
		}

		return (
			<FlatList
				data={states.workouts}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
				initialNumToRender={25}
				onEndReached={actions.onEndReached}
				onEndReachedThreshold={0.3}
				ListFooterComponent={
					<>
						{states.isFetchingNextPage && (
							<ActivityIndicator
								testID={WORKOUT_LIST_SCREEN_TEST_IDS.LOADING_NEXT_PAGE}
							/>
						)}
						{!states.isSearching && (
							<Pressable.Root
								onPress={actions.openModal}
								style={styles.addButton}>
								<Text
									variant="body-large-bold"
									style={styles.addButtonText}>
									Adicionar treino
								</Text>
							</Pressable.Root>
						)}
					</>
				}
				refreshControl={
					<RefreshControl
						refreshing={states.isRefetchingWorkouts}
						onRefresh={actions.onRefresh}
						colors={[styles.refreshControl.color]}
						tintColor={styles.refreshControl.color}
					/>
				}
				renderItem={({ item }) => (
					<WorkoutCard
						id={item.id}
						title={item.title}
						exerciseCount={5}
						category={item.category}
						imageUrl={item.imageUrl ?? undefined}
						onRedirect={() => actions.onOpenWorkout(item.id)}
						onDelete={() => actions.onDeleteWorkout(item.id)}
					/>
				)}
				ListEmptyComponent={
					states.isSearching ? (
						<View
							style={styles.searchEmptyContainer}
							testID={WORKOUT_LIST_SCREEN_TEST_IDS.NO_SEARCH_RESULTS}>
							<Text variant="body-large-regular">
								Não foi possível encontrar seus treinos.
							</Text>
						</View>
					) : null
				}
				testID={WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_LIST}
			/>
		)
	}

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.HorizontalCenterTitle>Meus treinos</Header.HorizontalCenterTitle>
			</Header.Root>

			<SearchBar control={form.control} />
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
