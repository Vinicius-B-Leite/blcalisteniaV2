import { Dimensions } from "react-native"
import { spacings, radius } from "@/themes"
import type { ThemeType } from "@/themes"
import { WorkoutBannerCard } from "./WorkoutBannerCardTypes"

const { height } = Dimensions.get("window")

export const workoutBannerCardVariantsKeys = {
	default: "default",
}

export const workoutBannerCardVariants = (
	theme: ThemeType,
): Record<keyof typeof workoutBannerCardVariantsKeys, WorkoutBannerCard.Variant> => {
	const defaultVariant = {
		container: {
			width: "100%" as const,
			height: height * 0.3,
			borderRadius: radius[16],
			overflow: "hidden" as const,
			marginTop: spacings.margin[8],
		},
		image: {
			width: "100%" as const,
			height: "100%" as const,
		},
		overlay: {
			height: "100%" as const,
			position: "absolute" as const,
			bottom: 0,
			left: 0,
			right: 0,
			justifyContent: "flex-end" as const,
			padding: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
			backgroundColor: "rgba(0, 0, 0, 0.5)",
		},
		row: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "center" as const,
			width: "100%" as const,
		},
		content: {
			flexDirection: "column" as const,
			justifyContent: "center" as const,
			gap: spacings.gap[8],
		},
		textContainer: {
			gap: spacings.gap[4],
		},
		title: {
			variant: "body-large-bold" as const,
			style: {
				color: theme.content["always-white"],
			},
		},
		subtitle: {
			variant: "caption-reg" as const,
			style: {
				color: theme.content["always-white"],
			},
		},
		tagsContainer: {
			flexDirection: "row" as const,
			gap: spacings.gap[8],
		},
		tag: {
			flexDirection: "row" as const,
			justifyContent: "center" as const,
			alignItems: "center" as const,
			paddingVertical: spacings.padding[4],
			paddingHorizontal: spacings.padding[12],
			borderRadius: radius[8],
			borderWidth: 1,
			borderColor: theme.border.default,
		},
		tagText: {
			variant: "caption-reg" as const,
			style: {
				color: theme.content["always-white"],
			},
		},
		editButton: {
			style: {
				borderRadius: radius.full,
				backgroundColor: theme.surface.brand,
				justifyContent: "center" as const,
				alignItems: "center" as const,
				padding: spacings.padding[12],
			},
		},
	}

	return {
		default: defaultVariant,
	}
}
