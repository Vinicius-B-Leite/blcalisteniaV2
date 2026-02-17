import { View, ScrollView, FlatList } from "react-native"
import { Screen, Header, Text, Button } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useSearchExercises } from "./useSearchExercises"
import { SearchBar, CategoryFilter, ExerciseCard } from "./components"

export const SearchExercises = () => {
	const { states, actions } = useSearchExercises()
	const styles = useStyles(stylesTheme)

	const selectedCount = states.selectedExercises.length

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Buscar exercícios</Header.VerticalCenterTitle>
			</Header.Root>

			<View style={styles.content}>
				<SearchBar
					placeholder="Buscar exercícios"
					value={states.searchText}
					onChangeText={actions.handleSearchChange}
				/>

				<CategoryFilter
					categories={states.categories}
					selectedCategory={states.selectedCategory}
					onSelectCategory={actions.handleCategorySelect}
				/>

				<FlatList
					data={states.exercises}
					renderItem={({ item }) => (
						<ExerciseCard
							title={item.title}
							category={item.category}
							imageUrl={item.imageUrl}
							isSelected={states.selectedExercises.includes(item.id)}
							onAdd={() => actions.handleToggleExercise(item.id)}
						/>
					)}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.exercisesSection}
					scrollEnabled={false}
				/>

				{!states.isCustomExercisesEmpty && (
					<View style={styles.customExercisesSection}>
						<Text variant="body-large-bold">
							Exercícios que você já criou:
						</Text>
						<FlatList
							data={states.customExercises}
							renderItem={({ item }) => (
								<ExerciseCard
									title={item.title}
									category={item.category}
									showImage={false}
									isSelected={states.selectedExercises.includes(
										item.id,
									)}
									onAdd={() => actions.handleToggleExercise(item.id)}
								/>
							)}
							keyExtractor={(item) => item.id}
							contentContainerStyle={styles.exercisesList}
							scrollEnabled={false}
						/>
					</View>
				)}
			</View>
			<View style={styles.addButtonContainer}>
				<Button.Root
					disabled={selectedCount === 0}
					variant="primary"
					onPress={actions.handleAddExercises}>
					<Button.Content>
						Adicionar {selectedCount > 0 ? selectedCount : ""}{" "}
						{selectedCount === 1 ? "exercício" : "exercícios"}
					</Button.Content>
				</Button.Root>
			</View>
		</Screen>
	)
}
