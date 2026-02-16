import { spacings, radius } from "@/themes"
import type { ThemeType } from "@/themes"
import { Button } from "./ButtonTypes"

export const buttonVariantsKeys = {
	primary: "primary",
	ghost: "ghost",
}

export const buttonVariants = (
	theme: ThemeType,
): Record<keyof typeof buttonVariantsKeys, Button.Variant> => {
	const defaultVariant = {
		root: {
			gap: spacings.gap[8],
			padding: spacings.padding[8],
			borderRadius: radius[24],
			justifyContent: "center" as const,
			alignItems: "center" as const,
		},
		content: {
			variant: "title-small-bold" as const,
		},
	}

	return {
		primary: {
			root: {
				...defaultVariant.root,
				backgroundColor: theme.action["brand-background"],
			},
			content: {
				...defaultVariant.content,
			},
		},
		ghost: {
			root: {
				...defaultVariant.root,
				borderWidth: 0,
				borderColor: theme.content["text-default"],
			},
			content: {
				...defaultVariant.content,
			},
		},
	}
}
