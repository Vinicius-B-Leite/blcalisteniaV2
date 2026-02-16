import { useRef } from "react"
import { Pressable, TextInput } from "react-native"
import { spacings } from "../../../theme/tokens/spacings"
import { radius } from "../../../theme/tokens/sizes"
import { InputProvider } from "./InputContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { Input, variantsKeys } from "./InputTypes"
import { textVariants } from "../Text/Text"

export const InputRoot = ({
	children,
	variant = "default",
	style,
	...props
}: Input.RootProps) => {
	const { theme } = useAppTheme()
	const inputRef = useRef<TextInput>(null)

	const _textVariants = textVariants(theme)

	const variants: Record<keyof typeof variantsKeys, Input.Variant> = {
		default: {
			container: {
				gap: spacings.gap[8],
			},
			label: {
				variant: "body-large-bold",
			},
			field: {
				container: {
					borderWidth: 1,
					borderColor: theme.border.default,
					borderRadius: radius[8],
					gap: spacings.gap[8],
					backgroundColor: theme.surface.background,
					paddingVertical: spacings.padding[8],
					paddingHorizontal: spacings.padding[12],
					flexDirection: "row",
				},
				input: {
					flex: 1,
					color: theme.content["text-default"],
					..._textVariants["body-large-regular"],
				},
			},
		},
		focus: {
			container: {
				gap: spacings.gap[8],
			},
			label: {
				variant: "body-large-bold",
				style: {
					color: theme.content["text-brand"],
				},
			},
			field: {
				container: {
					borderWidth: 2,
					borderColor: theme.content["text-brand"],
					borderRadius: radius[8],
					paddingVertical: spacings.padding[8],
					paddingHorizontal: spacings.padding[12],
					gap: spacings.gap[8],
					flexDirection: "row",
				},
				input: {
					flex: 1,
					..._textVariants["body-large-regular"],
				},
			},
		},
		error: {
			container: {
				gap: spacings.gap[8],
			},
			label: {
				variant: "body-large-bold",
				style: {
					color: theme.content["text-error"],
				},
			},
			field: {
				container: {
					borderWidth: 2,
					borderColor: theme.border.error,
					borderRadius: radius[8],
					paddingVertical: spacings.padding[8],
					paddingHorizontal: spacings.padding[12],
					gap: spacings.gap[8],
					flexDirection: "row",
				},
				input: {
					flex: 1,
					..._textVariants["body-large-regular"],
				},
			},
		},
	}

	const currentVariant = variants[variant]

	const handlePress = () => {
		inputRef.current?.focus()
	}

	return (
		<InputProvider value={{ variant: currentVariant, inputRef }}>
			<Pressable
				onPress={handlePress}
				style={[currentVariant.container, style]}
				{...props}>
				{children}
			</Pressable>
		</InputProvider>
	)
}
