import { createContext, useContext } from "react"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

export const WorkoutBannerCardContext = createContext({} as WorkoutBannerCard.ContextType)

export const WorkoutBannerCardProvider = WorkoutBannerCardContext.Provider

export const useWorkoutBannerCardContext = () => {
	const context = useContext(WorkoutBannerCardContext)
	if (!context) {
		throw new Error(
			"WorkoutBannerCard sub-components must be used within WorkoutBannerCard.Root",
		)
	}
	return context
}
