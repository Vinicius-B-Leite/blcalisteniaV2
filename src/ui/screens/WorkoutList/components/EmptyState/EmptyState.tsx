import { View, Image } from "react-native"
import { Text, Button } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"

type EmptyStateProps = {
	handleOpenModal(): void
}

export const EmptyState = ({ handleOpenModal }: EmptyStateProps) => {
	const styles = useStyles(stylesTheme)
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.imagesContainer}>
					<Image
						source={require("../../../../../assets/imgs/workout-banner-2.png")}
						style={[styles.image, styles.image1]}
						resizeMode="cover"
					/>
					<Image
						source={require("../../../../../assets/imgs/workout-banner-3.jpg")}
						style={[styles.image, styles.image2]}
						resizeMode="cover"
					/>
					<Image
						source={require("../../../../../assets/imgs/workout-banner-1.png")}
						style={[styles.image, styles.image3]}
						resizeMode="cover"
					/>
				</View>
				<Text variant="title" style={styles.title}>
					Você ainda não tem treinos por aqui!
				</Text>
			</View>
			<View style={styles.footer}>
				<Text variant="body-large-regular" style={styles.description}>
					Comece agora criando o seu primeiro treino personalizado!
				</Text>
				<View style={styles.buttonsContainer}>
					<Button.Root onPress={handleOpenModal} variant="primary">
						<Button.Content>Criar treino</Button.Content>
					</Button.Root>
					<Button.Root variant="ghost">
						<Button.Content>Aproveitar sugestões</Button.Content>
					</Button.Root>
				</View>
			</View>
		</View>
	)
}
