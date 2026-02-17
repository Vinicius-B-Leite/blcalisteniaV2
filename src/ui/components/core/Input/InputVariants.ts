import { spacings, radius } from "@/themes"
import type { ThemeType } from "@/themes"
import { textVariants } from "../Text/TextVariants"
import { Input } from "./InputTypes"

export const inputVariantsKeys = {
	default: "default",
	focus: "focus",
	error: "error",
}

export const inputVariants = (
	theme: ThemeType,
): Record<keyof typeof inputVariantsKeys, Input.Variant> => {
	const _textVariants = textVariants(theme)

	const defaultVariant = {
		container: {
			gap: spacings.gap[8],
		},
		label: {
			variant: "body-large-bold" as const,
		},
		field: {
			container: {
				borderRadius: radius[8],
				paddingVertical: spacings.padding[8],
				paddingHorizontal: spacings.padding[12],
				gap: spacings.gap[8],
				flexDirection: "row" as const,
			},
			input: {
				flex: 1,
				..._textVariants["body-large-regular"],
			},
		},
	}

	return {
		default: {
			container: {
				...defaultVariant.container,
			},
			label: {
				...defaultVariant.label,
			},
			field: {
				container: {
					...defaultVariant.field.container,
					borderWidth: 1,
					borderColor: theme.border.default,
					backgroundColor: theme.surface.background,
				},
				input: {
					...defaultVariant.field.input,
					color: theme.content["text-default"],
				},
			},
		},
		focus: {
			container: {
				...defaultVariant.container,
			},
			label: {
				...defaultVariant.label,
				style: {
					color: theme.content["text-brand"],
				},
			},
			field: {
				container: {
					...defaultVariant.field.container,
					borderWidth: 2,
					borderColor: theme.content["text-brand"],
				},
				input: {
					...defaultVariant.field.input,
				},
			},
		},
		error: {
			container: {
				...defaultVariant.container,
			},
			label: {
				...defaultVariant.label,
				style: {
					color: theme.content["text-error"],
				},
			},
			field: {
				container: {
					...defaultVariant.field.container,
					borderWidth: 2,
					borderColor: theme.border.error,
				},
				input: {
					...defaultVariant.field.input,
				},
			},
		},
	}
}
