import { Text } from "../Text/Text"
import { useInputContext } from "./InputContext"
import { Input } from "./InputTypes"

export const InputLabel = ({ children, ...props }: Input.LabelProps) => {
	const { variant } = useInputContext()
	return (
		<Text variant={variant.label!.variant} {...props}>
			{children}
		</Text>
	)
}
