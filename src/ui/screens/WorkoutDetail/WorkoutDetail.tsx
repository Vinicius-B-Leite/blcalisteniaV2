import { FlatList, View } from "react-native"
import { Screen, Header, Button } from "@/components/core"
import {
	ExerciseCard,
	EmptyState,
	AddExerciseModal,
	LoadingState,
	DeleteExerciseModal,
} from "./components"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { useWorkoutDetail } from "./useWorkoutDetail"
import { WorkoutBannerCard, WorkoutFormModal } from "@/components/molecules"
import { workoutUtils, workoutBannerUtils } from "@/utils"
import { WORKOUT_DETAIL_SCREEN_TEST_IDS } from "./constants"

export const WorkoutDetail = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)
	const { actions, state } = useWorkoutDetail()

	const hasExercises = state.exercises.length > 0
	const weekDayLabels = state.workout?.weekDaysFrequency
		? workoutUtils.getWeekDayLabels(state.workout.weekDaysFrequency)
		: []

	const imageUrl = workoutBannerUtils.resolveWorkoutBanner(
		state.workout?.imageUrl ?? undefined,
	)

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
				testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_LIST}
				data={state.exercises}
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
						id={item.workoutExerciseId}
						title={item.name}
						muscleGroup={item.musclesGroups}
						imageUrl={item.bannerUrl}
						onPress={() => actions.handleExercisePress(item.id)}
						onEditPress={() =>
							actions.handleExerciseEditPress(item.workoutExerciseId)
						}
						onDeletePress={() =>
							actions.handleExerciseDeletePress(
								item.workoutExerciseId,
								item.name,
							)
						}
					/>
				)}
				ListEmptyComponent={<EmptyState />}
			/>

			<View style={styles.buttonsContainer}>
				{hasExercises && (
					<Button.Root
						onPress={actions.handleStartWorkout}
						testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.START_WORKOUT_BUTTON}>
						<Button.Content>Começar treino</Button.Content>
					</Button.Root>
				)}

				<Button.Root
					variant={hasExercises ? "ghost" : "primary"}
					onPress={actions.handleAddExercise}
					testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_EXERCISE_BUTTON}>
					<Button.Content>Adicionar exercícios</Button.Content>
				</Button.Root>
			</View>

			<AddExerciseModal
				visible={state.isAddExerciseModalVisible}
				onClose={actions.handleCloseAddExerciseModal}
				workoutId={state.workout?.id || ""}
				workoutExerciseId={state.editModalWorkoutExerciseId ?? undefined}
			/>

			<DeleteExerciseModal
				visible={state.deleteModal !== null}
				exerciseName={state.deleteModal?.exerciseName ?? ""}
				onClose={actions.handleCloseDeleteModal}
				onConfirm={actions.handleConfirmDeleteExercise}
				isLoading={state.isRemoveLoading}
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
