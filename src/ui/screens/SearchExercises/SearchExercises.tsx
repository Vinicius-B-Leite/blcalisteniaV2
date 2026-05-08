import { View, ScrollView, FlatList } from "react-native"
import { Screen, Header, Button, Skeleton } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useSearchExercises } from "./useSearchExercises"
import {
	SearchBar,
	CategoryFilter,
	ExerciseCard,
	CreateExerciseModal,
} from "./components"
import { DeleteExerciseModal } from "./components/ExerciseCard/components/DeleteExerciseModal"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "./constants"

export const SearchExercises = () => {
	const { states, actions, form } = useSearchExercises()
	const styles = useStyles(stylesTheme)

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Buscar exercícios</Header.VerticalCenterTitle>
			</Header.Root>

			{states.isLoading ? (
				<ScrollView
					testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.LOADING_STATE}
					contentContainerStyle={styles.content}
					showsVerticalScrollIndicator={false}>
					{Array(6)
						.fill(null)
						.map((_, index) => (
							<Skeleton key={index} style={styles.loadingItem} />
						))}
				</ScrollView>
			) : (
				<ScrollView
					contentContainerStyle={[styles.content]}
					showsVerticalScrollIndicator={false}>
					<SearchBar control={form.control} />

					<CategoryFilter
						selectedCategory={states.selectedMuscleGroup}
						onSelectCategory={actions.handleMuscleGroupSelect}
					/>

					<FlatList
						data={states.exercises}
						renderItem={({ item }) => (
							<ExerciseCard
								id={item.id}
								name={item.name}
								musclesGroups={item.musclesGroups}
								bannerUrl={item.bannerUrl}
								isSelected={states.selectedExercise?.id === item.id}
								onAdd={() => actions.handleToggleExercise(item)}
								isCustom={actions.isCustomExercise(item)}
								onEdit={
									actions.isCustomExercise(item)
										? () => actions.handleOpenEditModal(item)
										: undefined
								}
								onDelete={
									actions.isCustomExercise(item)
										? () => actions.handleOpenDeleteModal(item)
										: undefined
								}
							/>
						)}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.exercisesSection}
						scrollEnabled={false}
					/>
				</ScrollView>
			)}
			<View style={styles.addButtonContainer}>
				<Button.Root
					disabled={states.selectedExercise === null}
					variant="primary"
					onPress={actions.handleAddExercises}
					testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON}>
					<Button.Content>Adicionar exercício</Button.Content>
				</Button.Root>

				<Button.Root
					variant="ghost"
					onPress={actions.handleOpenCreateModal}
					testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.CREATE_EXERCISE_BUTTON}>
					<Button.Content>Criar novo exercício</Button.Content>
				</Button.Root>
			</View>

			<CreateExerciseModal
				visible={states.isCreateModalVisible}
				onClose={actions.handleCloseModal}
				initialValues={
					states.editingExercise ? states.editingExercise : undefined
				}
			/>

			<DeleteExerciseModal
				visible={states.selectedExerciseToDelete !== null}
				exerciseName={states.selectedExerciseToDelete?.name ?? null}
				onClose={actions.handleCloseDeleteModal}
				onConfirm={actions.handleConfirmDelete}
				isLoading={states.isDeletingExercise}
			/>
		</Screen>
	)
}
