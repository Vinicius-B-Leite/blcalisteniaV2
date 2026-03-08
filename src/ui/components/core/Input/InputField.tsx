import { TextInput } from "react-native"
import { Controller, FieldValues } from "react-hook-form"
import { useInputContext } from "./InputContext"
import { Input } from "./InputTypes"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"

export const InputField = <T extends FieldValues = any>({
	style,
	placeholderTextColor,
	...props
}: Input.FieldProps) => {
	const { variant, inputRef, control, name } = useInputContext<T>()
	const { theme } = useAppTheme()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, onBlur, value } }) => (
				<TextInput
					ref={inputRef}
					style={[variant.field.input, style]}
					placeholderTextColor={
						placeholderTextColor || theme.content["text-variant"]
					}
					onChangeText={onChange}
					onBlur={onBlur}
					value={value}
					{...props}
				/>
			)}
		/>
	)
}
