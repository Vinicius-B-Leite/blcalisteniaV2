import { TouchableOpacity } from "react-native"
import { useAppTheme } from "@/themes"
import { ButtonProvider } from "./ButtonContext"
import { Button } from "./ButtonTypes"
import { buttonVariants } from "./ButtonVariants"

export const ButtonRoot = ({
	children,
	variant = "primary",
	...props
}: Button.RootProps) => {
	const { theme } = useAppTheme()

	const variants = buttonVariants(theme)

	let currentVariant = variants[variant]
	if (props.disabled || props.isLoading) {
		currentVariant = variants["disabled"]
	}

	return (
		<ButtonProvider value={{ variant: currentVariant, isLoading: props.isLoading }}>
			<TouchableOpacity activeOpacity={0.8} style={currentVariant.root} {...props}>
				{children}
			</TouchableOpacity>
		</ButtonProvider>
	)
}
