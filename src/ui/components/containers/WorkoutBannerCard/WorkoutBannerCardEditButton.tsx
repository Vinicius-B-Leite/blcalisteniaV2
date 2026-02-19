import { Pressable, Icon } from "../../core"
import { useWorkoutBannerCardContext } from "./WorkoutBannerCardContext"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

export const WorkoutBannerCardEditButton = ({
	onPress,
}: WorkoutBannerCard.EditButtonProps) => {
	const { variant } = useWorkoutBannerCardContext()
	return (
		<Pressable.Root onPress={onPress} {...variant.editButton}>
			<Icon name="edit" size={24} />
		</Pressable.Root>
	)
}
