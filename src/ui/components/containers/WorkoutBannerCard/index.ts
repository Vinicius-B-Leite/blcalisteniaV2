import { WorkoutBannerCardRoot } from "./WorkoutBannerCardRoot"
import { WorkoutBannerCardContent } from "./WorkoutBannerCardContent"
import { WorkoutBannerCardTextContainer } from "./WorkoutBannerCardTextContainer"
import { WorkoutBannerCardTitle } from "./WorkoutBannerCardTitle"
import { WorkoutBannerCardSubtitle } from "./WorkoutBannerCardSubtitle"
import { WorkoutBannerCardTags } from "./WorkoutBannerCardTags"
import { WorkoutBannerCardTag } from "./WorkoutBannerCardTag"
import { WorkoutBannerCardEditButton } from "./WorkoutBannerCardEditButton"

export const WorkoutBannerCard = {
	Root: WorkoutBannerCardRoot,
	Content: WorkoutBannerCardContent,
	TextContainer: WorkoutBannerCardTextContainer,
	Title: WorkoutBannerCardTitle,
	Subtitle: WorkoutBannerCardSubtitle,
	Tags: WorkoutBannerCardTags,
	Tag: WorkoutBannerCardTag,
	EditButton: WorkoutBannerCardEditButton,
}

export { type WorkoutBannerCard as WorkoutBannerCardTypes } from "./WorkoutBannerCardTypes"
export {
	workoutBannerCardVariants,
	workoutBannerCardVariantsKeys,
} from "./WorkoutBannerCardVariants"
