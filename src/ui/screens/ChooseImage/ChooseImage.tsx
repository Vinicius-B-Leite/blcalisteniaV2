import { Screen, Header, Text, Button } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useChooseImage } from "./useChooseImage"
import { ImageSelector } from "./components"
import { View, ActivityIndicator } from "react-native"
import { WorkoutBannerCard } from "@/components/containers"
import { workoutBannerUtils } from "src/utils/workoutBanner"

export const ChooseImage = () => {
	const { states, actions } = useChooseImage()
	const styles = useStyles(stylesTheme)

	const previewImage = states.selectedImage
		? workoutBannerUtils.resolveWorkoutBanner(states.selectedImage)
		: undefined

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>Escolha imagem</Header.VerticalCenterTitle>
			</Header.Root>

			<View style={styles.content}>
				<View>
					<Text variant="body-large-bold" style={styles.title}>
						Pré visualização
					</Text>

					<WorkoutBannerCard.Root imageUrl={previewImage}>
						<WorkoutBannerCard.Content>
							<WorkoutBannerCard.TextContainer>
								<WorkoutBannerCard.Title>
									{states.workout?.title || "Treino A"}
								</WorkoutBannerCard.Title>
								<WorkoutBannerCard.Subtitle>
									{states.workout?.description || "Descrição do treino"}
								</WorkoutBannerCard.Subtitle>
							</WorkoutBannerCard.TextContainer>
							<WorkoutBannerCard.Tags>
								<WorkoutBannerCard.Tag>
									{states.workout?.category || "Força"}
								</WorkoutBannerCard.Tag>
								{states.workout?.weekDaysFrequency.length && (
									<WorkoutBannerCard.Tag>
										{states.workout.weekDaysFrequency.length}x semana
									</WorkoutBannerCard.Tag>
								)}
							</WorkoutBannerCard.Tags>
						</WorkoutBannerCard.Content>
						<WorkoutBannerCard.EditButton />
					</WorkoutBannerCard.Root>
				</View>

				<View>
					<Text variant="body-large-bold" style={styles.secondTitle}>
						Escolha uma imagem
					</Text>
					<Text variant="body-small-reg" style={styles.description}>
						Você pode escolher uma imagem que disponibilizamos ou adicionar
						uma imagem do seu celular.
					</Text>

					<ImageSelector
						selectedImage={states.selectedImage}
						onImageSelect={actions.handleImageSelect}
						onAddImage={actions.handleAddImage}
						isAddingImage={states.isAddingImage}
					/>
				</View>
			</View>

			<Button.Root
				onPress={actions.handleConfirm}
				disabled={!states.selectedImage}
				isLoading={states.isUpdating}>
				<Button.Content>Confirmar</Button.Content>
			</Button.Root>
		</Screen>
	)
}
