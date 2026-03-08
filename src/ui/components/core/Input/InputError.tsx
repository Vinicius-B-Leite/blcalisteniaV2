import { useContext } from "react"
import { FieldValues, useFormState } from "react-hook-form"
import { InputContext } from "./InputContext"
import { Input } from "./InputTypes"
import { Text } from "../Text"
import { useAppTheme } from "@/themes/hooks"

export const InputError = <T extends FieldValues = any>({
	children,
	style,
	...props
}: Input.ErrorProps) => {
	const { theme } = useAppTheme()
	const context = useContext(InputContext) as Input.ContextType<T> | undefined

	if (!context?.control || !context?.name) {
		if (!children) return null
		return (
			<Text variant="body-small-reg" style={style} {...props}>
				{children}
			</Text>
		)
	}

	const { errors } = useFormState({ control: context.control })
	const error = errors[context.name]

	const errorMessage = error?.message as string | undefined
	if (!errorMessage && !children) return null

	const displayMessage = errorMessage || children

	return (
		<Text
			variant="body-small-reg"
			style={[{ color: theme.content["text-error"] }, style]}
			{...props}>
			{displayMessage}
		</Text>
	)
}
