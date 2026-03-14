import { ImageStorageService } from "@/infra/services"
import { ImageSourcePropType } from "react-native"

export const WORKOUT_BANNER_PATHS = [
	"@/assets/imgs/workout-banner-1.png",
	"@/assets/imgs/workout-banner-2.png",
	"@/assets/imgs/workout-banner-3.jpg",
] as const

export const WORKOUT_BANNER_MAP: Record<string, ImageSourcePropType> = {
	"@/assets/imgs/workout-banner-1.png": require("@/assets/imgs/workout-banner-1.png"),
	"@/assets/imgs/workout-banner-2.png": require("@/assets/imgs/workout-banner-2.png"),
	"@/assets/imgs/workout-banner-3.jpg": require("@/assets/imgs/workout-banner-3.jpg"),
}

const DEFAULT_BANNER = require("@/assets/imgs/workout-banner-1.png")

const getRandomWorkoutBanner = (): string => {
	const randomIndex = Math.floor(Math.random() * WORKOUT_BANNER_PATHS.length)
	return WORKOUT_BANNER_PATHS[randomIndex]
}

const resolveWorkoutBanner = (path?: string): ImageSourcePropType => {
	if (!path) return DEFAULT_BANNER
	const isLocalImage = ImageStorageService.isLocalImage(path)
	if (isLocalImage) {
		return WORKOUT_BANNER_MAP[path]
	}

	return { uri: path }
}

export const workoutBannerUtils = {
	getRandomWorkoutBanner,
	resolveWorkoutBanner,
}
