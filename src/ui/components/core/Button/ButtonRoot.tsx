import {
	StyleProp,
	TouchableOpacity,
	TouchableOpacityProps,
	ViewStyle,
} from "react-native"
import { TextProps } from "../Text/Text"
import { spacings } from "../../../theme/tokens/spacings"
import { radius } from "../../../theme/tokens/sizes"
import { ButtonProvider } from "./ButtonContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"

const variantsKeys = {
	primary: "primary",
}

export type ButtonVariantsKeys = keyof typeof variantsKeys
export type ButtonVariant = {
	root: StyleProp<ViewStyle>
	content: TextProps
}

type ButtonRootProps = TouchableOpacityProps & {
	variant: ButtonVariantsKeys
}

export const ButtonRoot = ({ children, variant, ...props }: ButtonRootProps) => {
	const { theme } = useAppTheme()

	const variants: Record<keyof typeof variantsKeys, ButtonVariant> = {
		primary: {
			root: {
				gap: spacings.gap[8],
				padding: spacings.padding[8],
				borderRadius: radius[24],
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: theme.action["brand-primary"],
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
