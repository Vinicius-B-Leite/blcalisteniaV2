import { Text } from "../../core"
import { useWorkoutBannerCardContext } from "./WorkoutBannerCardContext"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

export const WorkoutBannerCardSubtitle = ({
	children,
}: WorkoutBannerCard.SubtitleProps) => {
	const { variant } = useWorkoutBannerCardContext()
	return <Text {...variant.subtitle}>{children}</Text>
}
