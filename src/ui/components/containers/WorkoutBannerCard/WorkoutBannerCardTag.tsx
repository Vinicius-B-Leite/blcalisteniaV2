import { View } from "react-native"
import { Text } from "../../core"
import { useWorkoutBannerCardContext } from "./WorkoutBannerCardContext"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

export const WorkoutBannerCardTag = ({ children }: WorkoutBannerCard.TagProps) => {
	const { variant } = useWorkoutBannerCardContext()
	return (
		<View style={variant.tag}>
			<Text {...variant.tagText}>{children}</Text>
		</View>
	)
}
