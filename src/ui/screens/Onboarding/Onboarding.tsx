import { ImageBackground, View } from "react-native"
import BackgroundImage from "@/assets/imgs/onboarding-background.png"

import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"

import { Text, Button } from "@/components/core"
import { stylesTheme } from "./styles"

import { useStyles } from "@/themes"
import { useOnboarding } from "./useOnboarding"

export function OnboardingScreen() {
	const { actions, states } = useOnboarding()

	const styles = useStyles((theme) => stylesTheme(theme, states.insets))

	return (
		<ImageBackground source={BackgroundImage} style={styles.imageBackground}>
			<StatusBar style={"light"} />

			<LinearGradient
				colors={[states.theme.surface.background, "transparent"]}
				start={{ x: 0, y: 1 }}
				end={{ x: 0, y: 0 }}
				style={styles.linearGradient}
			/>

			<View style={styles.container}>
				<View>
					<Text variant="heading">Treine com o peso do seu corpo</Text>
					<Text variant="body-large-regular">
						Transforme qualquer lugar em uma academia e evolua com treinos de
						calistenia personalizados.
					</Text>
				</View>
				<Button.Root onPress={actions.handleContinueAsGuest} variant="primary">
					<Button.Content>Entrar como Visitante</Button.Content>
				</Button.Root>
			</View>
		</ImageBackground>
	)
}
