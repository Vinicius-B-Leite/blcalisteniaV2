import { spacings, radius } from "@/themes"
import type { ThemeType } from "@/themes"
import { Toast } from "./ToastTypes"

export const toastVariantsKeys = {
	success: "success",
	error: "error",
	warning: "warning",
}

export const toastVariants = (
	theme: ThemeType,
): Record<keyof typeof toastVariantsKeys, Toast.Variant> => {
	const defaultVariant: Toast.Variant = {
		container: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacings.gap[8],
			paddingVertical: spacings.padding[12],
			paddingHorizontal: spacings.padding[16],
			borderRadius: radius[12],
			width: "60%" as const,
		},
		message: {
			variant: "body-small-bold" as const,
			style: { flex: 1, textAlign: "center" },
		},
	}

	return {
		success: {
			container: {
				...defaultVariant.container,
				backgroundColor: theme.surface.success,
				borderWidth: 1,
				borderColor: theme.border.success,
			},
			message: {
				...defaultVariant.message,
			},
		},
		error: {
			container: {
				...defaultVariant.container,
				backgroundColor: theme.surface.error,
				borderWidth: 1,
				borderColor: theme.border.error,
			},
			message: {
				...defaultVariant.message,
			},
		},
		warning: {
			container: {
				...defaultVariant.container,
				backgroundColor: theme.surface.caution,
				borderWidth: 1,
				borderColor: theme.border.caution,
			},
			message: {
				...defaultVariant.message,
			},
		},
	}
}
