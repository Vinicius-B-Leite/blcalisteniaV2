import { Screen, Header, Text, Button } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { useChooseImage } from "./useChooseImage"
import { ImageSelector } from "./components"
import { View } from "react-native"
import { WorkoutBannerCard } from "@/components/containers"

export const ChooseImage = () => {
	const { states, actions } = useChooseImage()
	const styles = useStyles(stylesTheme)

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

					<WorkoutBannerCard.Root>
						<WorkoutBannerCard.Content>
							<WorkoutBannerCard.TextContainer>
								<WorkoutBannerCard.Title>
									Treino A
								</WorkoutBannerCard.Title>
								<WorkoutBannerCard.Subtitle>
									Treino de peito + triceps
								</WorkoutBannerCard.Subtitle>
							</WorkoutBannerCard.TextContainer>
							<WorkoutBannerCard.Tags>
								<WorkoutBannerCard.Tag>Força</WorkoutBannerCard.Tag>
								<WorkoutBannerCard.Tag>Seg</WorkoutBannerCard.Tag>
							</WorkoutBannerCard.Tags>
						</WorkoutBannerCard.Content>
						<WorkoutBannerCard.EditButton />
					</WorkoutBannerCard.Root>
				</View>

				<View>
					<Text variant="body-large-bold" style={styles.secondTitle}>
						Escolhe uma imagem
					</Text>
					<Text variant="body-small-reg" style={styles.description}>
						Você pode escolher uma imagem que disponibilizamos ou adicionar
						uma imagem do seu celular.
					</Text>

					<ImageSelector
						selectedImage={states.selectedImage}
						onImageSelect={actions.handleImageSelect}
						onAddImage={actions.handleAddImage}
					/>
				</View>
			</View>

			<Button.Root>
				<Button.Content>Confirmar</Button.Content>
			</Button.Root>
		</Screen>
	)
}
