import { ImageBackground, View } from "react-native"
import { Text } from "../ui/components/core/Text/Text"
import { Button } from "../ui/components/core/Button"
import { spacings } from "../ui/theme/tokens/spacings"
import BackgroundImage from "../assets/imgs/onboarding-background.png"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppTheme } from "../ui/theme/hooks/useAppTheme"
import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"

if (__DEV__) {
	import("../../ReactotronConfig").then(() => {
		console.tron("Reactotron Configured")
	})
}

export default function Page() {
	const insets = useSafeAreaInsets()
	const { theme } = useAppTheme()

	return (
		<ImageBackground
			source={BackgroundImage}
			style={{
				flex: 1,
				justifyContent: "flex-end",
			}}>
			<StatusBar style={"light"} />

			<LinearGradient
				colors={[theme.surface.background, "transparent"]}
				start={{ x: 0, y: 1 }}
				end={{ x: 0, y: 0 }}
				style={{
					height: 300,
				}}
			/>

			<View
				style={{
					gap: spacings.gap[32],
					paddingHorizontal: spacings.padding[20],
					backgroundColor: theme.surface.background,
					paddingBottom:
						Math.max(insets.bottom, spacings.padding[20]) +
						spacings.padding[20],
					paddingTop: spacings.padding[16],
				}}>
				<View>
					<Text variant="heading">Treine com o peso do seu corpo</Text>
					<Text variant="body-large-regular">
						Transforme qualquer lugar em uma academia e evolua com treinos de
						calistenia personalizados.
					</Text>
				</View>
				<Button.Root variant="primary">
					<Button.Content>Entrar como Visitante</Button.Content>
				</Button.Root>
			</View>
		</ImageBackground>
	)
}
