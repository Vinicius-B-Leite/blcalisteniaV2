import { View } from "react-native"
import { useWorkoutBannerCardContext } from "./WorkoutBannerCardContext"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

export const WorkoutBannerCardTextContainer = ({
	children,
}: WorkoutBannerCard.ContentProps) => {
	const { variant } = useWorkoutBannerCardContext()
	return <View style={variant.textContainer}>{children}</View>
}
