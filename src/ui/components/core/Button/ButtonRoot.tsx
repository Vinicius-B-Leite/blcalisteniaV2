import { TouchableOpacity } from "react-native"
import { spacings } from "../../../theme/tokens/spacings"
import { radius } from "../../../theme/tokens/sizes"
import { ButtonProvider } from "./ButtonContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { Button } from "./ButtonTypes"

export const variantsKeys = {
	primary: "primary",
	ghost: "ghost",
}

export const ButtonRoot = ({ children, variant, ...props }: Button.RootProps) => {
	const { theme } = useAppTheme()

	const variants: Record<keyof typeof variantsKeys, Button.Variant> = {
		primary: {
			root: {
				gap: spacings.gap[8],
				padding: spacings.padding[8],
				borderRadius: radius[24],
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: theme.action["brand-background"],
			},
			content: {
				variant: "title-small-bold",
			},
		},
		ghost: {
			root: {
				gap: spacings.gap[8],
				padding: spacings.padding[8],
				borderRadius: radius[24],
				justifyContent: "center",
				alignItems: "center",
				borderWidth: 0,
				borderColor: theme.content["text-default"],
			},
			content: {
				variant: "title-small-bold",
			},
		},
	}

	const currentVariant = variants[variant]

	return (
		<ButtonProvider value={{ variant: currentVariant }}>
			<TouchableOpacity activeOpacity={0.8} style={currentVariant.root} {...props}>
				{children}
			</TouchableOpacity>
		</ButtonProvider>
	)
}
