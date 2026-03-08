import { FlatList, View } from "react-native"
import { Screen, Header, Button, Text } from "@/components/core"
import { ExerciseCard, EmptyState, AddExerciseModal, LoadingState } from "./components"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { useWorkoutDetail } from "./useWorkoutDetail"
import { WorkoutBannerCard, WorkoutFormModal } from "@/components/containers"
import { workoutUtils } from "src/utils/workout"
import { workoutBannerUtils } from "src/utils/workoutBanner"

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
	const weekDayLabels = state.workout?.weekDaysFrequency
		? workoutUtils.getWeekDayLabels(state.workout.weekDaysFrequency)
		: []

	const imageUrl = workoutBannerUtils.resolveWorkoutBanner(state.workout?.imageUrl)

	if (state.isLoading) {
		return <LoadingState />
	}

	if (!state.workout) {
		return null
	}

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
					<WorkoutBannerCard.Root
						onPress={actions.handleNavigateToChangeImage}
						imageUrl={imageUrl}>
						<WorkoutBannerCard.Content>
							<WorkoutBannerCard.TextContainer>
								<WorkoutBannerCard.Title>
									{state.workout.title}
								</WorkoutBannerCard.Title>
								<WorkoutBannerCard.Subtitle>
									{state.workout.description}
								</WorkoutBannerCard.Subtitle>
							</WorkoutBannerCard.TextContainer>
							<WorkoutBannerCard.Tags>
								<WorkoutBannerCard.Tag>
									{state.workout.category}
								</WorkoutBannerCard.Tag>
								{weekDayLabels.map((label, index) => (
									<WorkoutBannerCard.Tag key={index}>
										{label}
									</WorkoutBannerCard.Tag>
								))}
							</WorkoutBannerCard.Tags>
						</WorkoutBannerCard.Content>
						<WorkoutBannerCard.EditButton onPress={actions.handleEditPress} />
					</WorkoutBannerCard.Root>
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

			<WorkoutFormModal
				title="Editar treino"
				confirmButtonText="Confirmar"
				onClose={actions.handleCloseEditWorkoutModal}
				visible={state.isCreateWorkoutModalVisible}
				renderHeaderExtra={
					<Button.Root
						variant="link"
						onPress={actions.handleNavigateToChangeImage}>
						<Button.Content>Editar imagem</Button.Content>
					</Button.Root>
				}
			/>
		</Screen>
	)
}
