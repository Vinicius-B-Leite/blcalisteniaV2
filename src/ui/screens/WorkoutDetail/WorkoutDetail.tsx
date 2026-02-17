import { FlatList, View } from "react-native"
import { Screen, Header, Button } from "@/components/core"
import { WorkoutCard, ExerciseCard, EmptyState, AddExerciseModal } from "./components"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { useWorkoutDetail } from "./useWorkoutDetail"

const MOCK_WORKOUT = {
	title: "Treino iniciante",
	subtitle: "Treino de peito + triceps",
	imageUrl: require("@/assets/imgs/workout-banner-1.png"),
	category: "Força",
	day: "Seg",
}

const MOCK_EXERCISES = [
	{
		id: "1",
		title: "Flexão Padrão",
		muscleGroup: "Peitoral",
		imageUrl: require("@/assets/imgs/workout-banner-1.png"),
	},
	{
		id: "2",
		title: "Ring Push Ups",
		muscleGroup: "Peitoral",
		imageUrl: require("@/assets/imgs/workout-banner-1.png"),
	},
	{
		id: "3",
		title: "Ring Push Ups",
		muscleGroup: "Peitoral",
		imageUrl: undefined,
	},
]

export const WorkoutDetail = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)
	const { actions, state } = useWorkoutDetail()

	const hasExercises = MOCK_EXERCISES.length > 0

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>
					Detalhes do Treino
				</Header.VerticalCenterTitle>
			</Header.Root>

			<FlatList
				data={MOCK_EXERCISES}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				ListHeaderComponentStyle={styles.listHeader}
				ListHeaderComponent={
					<WorkoutCard
						title={MOCK_WORKOUT.title}
						subtitle={MOCK_WORKOUT.subtitle}
						category={MOCK_WORKOUT.category}
						day={MOCK_WORKOUT.day}
						imageUrl={MOCK_WORKOUT.imageUrl}
						onEditPress={actions.handleEditPress}
					/>
				}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				renderItem={({ item }) => (
					<ExerciseCard
						title={item.title}
						muscleGroup={item.muscleGroup}
						imageUrl={item.imageUrl}
						onPress={() => actions.handleExercisePress(item.id)}
						onEditPress={() => actions.handleExerciseEditPress(item.id)}
						onDeletePress={() => actions.handleExerciseDeletePress(item.id)}
					/>
				)}
				ListEmptyComponent={<EmptyState />}
			/>

			<View style={styles.buttonsContainer}>
				{hasExercises && (
					<Button.Root onPress={actions.handleStartWorkout}>
						<Button.Content>Começar treino</Button.Content>
					</Button.Root>
				)}

				<Button.Root
					variant={hasExercises ? "ghost" : "primary"}
					onPress={actions.handleAddExercise}>
					<Button.Content>Adicionar exercícios</Button.Content>
				</Button.Root>
			</View>

			<AddExerciseModal
				visible={state.isAddExerciseModalVisible}
				onClose={actions.handleCloseAddExerciseModal}
			/>
		</Screen>
	)
}
