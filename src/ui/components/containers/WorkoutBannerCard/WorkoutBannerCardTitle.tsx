import { Text } from "../../core"
import { useWorkoutBannerCardContext } from "./WorkoutBannerCardContext"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

export const WorkoutBannerCardTitle = ({ children }: WorkoutBannerCard.TitleProps) => {
	const { variant } = useWorkoutBannerCardContext()
	return <Text {...variant.title}>{children}</Text>
}
