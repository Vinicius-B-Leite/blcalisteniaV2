import { View, ScrollView, FlatList } from "react-native"
import { Screen, Header, Text } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useSearchExercises } from "./useSearchExercises"
import { SearchBar, CategoryFilter, ExerciseCard } from "./components"

export const SearchExercises = () => {
	const { states, actions } = useSearchExercises()
	const styles = useStyles(stylesTheme)

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Buscar exercícios</Header.VerticalCenterTitle>
			</Header.Root>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}>
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
							onAdd={() => actions.handleExercisePress(item.id)}
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
									onAdd={() => actions.handleExercisePress(item.id)}
								/>
							)}
							keyExtractor={(item) => item.id}
							contentContainerStyle={styles.exercisesList}
							scrollEnabled={false}
						/>
					</View>
				)}
			</ScrollView>
		</Screen>
	)
}
