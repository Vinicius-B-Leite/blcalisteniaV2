import { Pressable } from "react-native"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { IconNotification } from "./components/IconNotification"
import { Icon } from "./IconTypes"
import { IconDumbbells } from "./components/IconDumbbells"
import { IconClock } from "./components/IconClock"
import { IconPlay } from "./components/IconPlay"
import { IconReturn } from "./components/IconReturn"
import { IconNotes } from "./components/IconNotes"
import { IconArrowRightTop } from "./components/IconArrowRightTop"
import { IconHeart } from "./components/IconHeart"
import { IconEye } from "./components/IconEye"
import { IconHome } from "./components/IconHome"
import { IconCalendar } from "./components/IconCalendar"
import { IconUser } from "./components/IconUser"

export const IconMap = {
	notification: IconNotification,
	clock: IconClock,
	dumbbells: IconDumbbells,
	play: IconPlay,
	return: IconReturn,
	notes: IconNotes,
	arrowRightTop: IconArrowRightTop,
	heart: IconHeart,
	eye: IconEye,
	home: IconHome,
	calendar: IconCalendar,
	user: IconUser,
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
