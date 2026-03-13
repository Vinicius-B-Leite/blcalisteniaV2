import { View } from "react-native"
import { useWorkoutBannerCardContext } from "./WorkoutBannerCardContext"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

export const WorkoutBannerCardContent = ({
	children,
}: WorkoutBannerCard.ContentProps) => {
	const { variant } = useWorkoutBannerCardContext()
	return <View style={variant.content}>{children}</View>
}
