import { useRef } from "react"
import { Pressable, TextInput } from "react-native"
import { FieldValues, useFormState } from "react-hook-form"
import { InputProvider } from "./InputContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { Input } from "./InputTypes"
import { inputVariants } from "./InputVariants"

export const InputRoot = <T extends FieldValues = any>({
	children,
	variant = "default",
	style,
	control,
	name,
	...props
}: Input.RootProps<T>) => {
	const { theme } = useAppTheme()
	const inputRef = useRef<TextInput>(null)
	const { errors } = useFormState({ control, name })

	const variants = inputVariants(theme)

	let currentVariant = variants[variant]
	if (errors?.[name]) {
		currentVariant = variants.error
	}

	const handlePress = () => {
		inputRef.current?.focus()
	}

	return (
		<InputProvider value={{ variant: currentVariant, inputRef, control, name }}>
			<Pressable
				onPress={handlePress}
				style={[currentVariant.container, style]}
				{...props}>
				{children}
			</Pressable>
		</InputProvider>
	)
}
