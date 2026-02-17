import { useRef } from "react"
import { Pressable, TextInput } from "react-native"
import { InputProvider } from "./InputContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { Input } from "./InputTypes"
import { inputVariants } from "./InputVariants"

export const InputRoot = ({
	children,
	variant = "default",
	style,
	...props
}: Input.RootProps) => {
	const { theme } = useAppTheme()
	const inputRef = useRef<TextInput>(null)

	const variants = inputVariants(theme)

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
