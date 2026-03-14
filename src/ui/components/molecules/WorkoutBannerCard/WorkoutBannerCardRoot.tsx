import { ImageBackground, View } from "react-native"
import { useAppTheme } from "@/themes"
import { WorkoutBannerCardProvider } from "./WorkoutBannerCardContext"

import { workoutBannerCardVariants } from "./WorkoutBannerCardVariants"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"
import { Pressable } from "@/components/core"

const MOCK_IMAGE = require("@/assets/imgs/workout-banner-1.png")

export const WorkoutBannerCardRoot = ({
	children,
	variant = "default",
	imageUrl,
	style,
	onPress,
	...props
}: WorkoutBannerCard.RootProps) => {
	const { theme } = useAppTheme()

	const variants = workoutBannerCardVariants(theme)

	const currentVariant = variants[variant]

	const Container = onPress ? Pressable.Root : View

	return (
		<WorkoutBannerCardProvider value={{ variant: currentVariant }}>
			<Container
				onPress={onPress}
				style={[currentVariant.container, style]}
				{...props}>
				<ImageBackground
					source={imageUrl ?? MOCK_IMAGE}
					style={currentVariant.image}
					resizeMode="cover">
					<View style={currentVariant.overlay}>
						<View style={currentVariant.row}>{children}</View>
					</View>
				</ImageBackground>
			</Container>
		</WorkoutBannerCardProvider>
	)
}
