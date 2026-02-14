import { ImageBackground, ScrollView, View } from "react-native"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { Text, Pressable, Icon } from "@/components/core"

export const RecommendedWorkout = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text variant="body-large-bold">Sugestões</Text>
			</View>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View style={styles.cardsContainer}>
					<ImageBackground
						style={styles.bannerCardImg}
						source={require("../../../../../assets/imgs/workout-banner-1.png")}>
						<View style={styles.overlay}>
							<View style={styles.textContainer}>
								<Text variant="body-large-bold">Iniciante</Text>
								<Text variant="body-small-reg">
									Aprenda o essencial e evolua com segurança.
								</Text>
							</View>
							<Pressable.Root style={styles.navButton}>
								<Icon name="arrowRightTop" size={20} />
							</Pressable.Root>
						</View>
					</ImageBackground>

					<ImageBackground
						style={styles.bannerCardImg}
						source={require("../../../../../assets/imgs/workout-banner-2.png")}>
						<View style={styles.overlay}>
							<View style={styles.textContainer}>
								<Text variant="body-large-bold">Intermediário</Text>
								<Text variant="body-small-reg">
									Aprenda o essencial e evolua com segurança.
								</Text>
							</View>
							<Pressable.Root style={styles.navButton}>
								<Icon name="arrowRightTop" size={20} />
							</Pressable.Root>
						</View>
					</ImageBackground>
				</View>
			</ScrollView>
		</View>
	)
}
