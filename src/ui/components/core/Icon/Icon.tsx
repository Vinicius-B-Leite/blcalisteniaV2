import { Pressable } from "react-native"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { IconNotification } from "./components/IconNotification"
import { Icon } from "./IconTypes"

export const IconMap = {
	"icon-notification": IconNotification,
}

export const IconComponent = ({
	name,
	size,
	variant = "default",
	onPress,
	pressableStyle,
}: Icon.Props) => {
	const IconComponent = IconMap[name]
	const { theme } = useAppTheme()

	const variants: Record<Icon.VariantKey, { color: string }> = {
		default: {
			color: theme.content["icon-default"],
		},
	}

	const currentVariant = variants[variant]

	if (onPress) {
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [pressableStyle, pressed && { opacity: 0.7 }]}
				hitSlop={12}>
				<IconComponent color={currentVariant.color} size={size} />
			</Pressable>
		)
	}

	return <IconComponent color={currentVariant.color} size={size} />
}
