import { WORKOUT_BANNER_PATHS, WORKOUT_BANNER_MAP } from "@/utils"
import { ImageSelector } from "./types"

export const IMAGE_OPTIONS: ImageSelector.ImageOption[] = WORKOUT_BANNER_PATHS.map(
	(path) => ({
		id: path,
		source: WORKOUT_BANNER_MAP[path],
	}),
)
