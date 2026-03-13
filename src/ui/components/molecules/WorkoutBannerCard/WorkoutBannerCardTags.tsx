import { View } from "react-native"
import { useWorkoutBannerCardContext } from "./WorkoutBannerCardContext"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

export const WorkoutBannerCardTags = ({ children }: WorkoutBannerCard.TagsProps) => {
	const { variant } = useWorkoutBannerCardContext()
	return <View style={variant.tagsContainer}>{children}</View>
}
