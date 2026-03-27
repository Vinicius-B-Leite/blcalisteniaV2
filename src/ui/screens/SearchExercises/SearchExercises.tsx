import { View, ScrollView, FlatList } from "react-native"
import { Screen, Header, Text, Button, Skeleton } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useSearchExercises } from "./useSearchExercises"
import { SearchBar, CategoryFilter, ExerciseCard } from "./components"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "./constants"

export const SearchExercises = () => {
	const { states, actions, form } = useSearchExercises()
	const styles = useStyles(stylesTheme)

	const selectedCount = states.selectedExercises.length

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
								isSelected={states.selectedExercises.includes(item.id)}
								onAdd={() => actions.handleToggleExercise(item.id)}
							/>
						)}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.exercisesSection}
						scrollEnabled={false}
					/>

					{!states.isCustomExercisesEmpty && (
						<View
							style={styles.customExercisesSection}
							testID={
								SEARCH_EXERCISES_SCREEN_TEST_IDS.CUSTOM_EXERCISES_SECTION
							}>
							<Text variant="body-large-bold">
								Exercícios que você já criou:
							</Text>
							<FlatList
								data={states.customExercises}
								renderItem={({ item }) => (
									<ExerciseCard
										id={item.id}
										name={item.name}
										musclesGroups={item.musclesGroups}
										isSelected={states.selectedExercises.includes(
											item.id,
										)}
										onAdd={() =>
											actions.handleToggleExercise(item.id)
										}
										isCustom
									/>
								)}
								keyExtractor={(item) => item.id}
								contentContainerStyle={styles.exercisesList}
								scrollEnabled={false}
							/>
						</View>
					)}
				</ScrollView>
			)}
			<View style={styles.addButtonContainer}>
				<Button.Root
					disabled={selectedCount === 0}
					variant="primary"
					onPress={actions.handleAddExercises}
					testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.ADD_BUTTON}>
					<Button.Content>
						Adicionar {selectedCount > 0 ? selectedCount : ""}{" "}
						{selectedCount === 1 ? "exercício" : "exercícios"}
					</Button.Content>
				</Button.Root>
			</View>
		</Screen>
	)
}
