import { View } from "react-native"
import { useInputContext } from "./InputContext"
import { Input } from "./InputTypes"

export const InputFieldWrapper = ({
	children,
	style,
	...props
}: Input.FieldWrapperProps) => {
	const { variant } = useInputContext()
	return (
		<View style={[variant.field.container, style]} {...props}>
			{children}
		</View>
	)
}
