import { TextInput } from "react-native"
import { useInputContext } from "./InputContext"
import { Input } from "./InputTypes"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"

export const InputField = ({
	style,
	placeholderTextColor,
	...props
}: Input.FieldProps) => {
	const { variant, inputRef } = useInputContext()
	const { theme } = useAppTheme()

	return (
		<TextInput
			ref={inputRef}
			style={[variant.field.input, style]}
			placeholderTextColor={placeholderTextColor || theme.content["text-variant"]}
			{...props}
		/>
	)
}
