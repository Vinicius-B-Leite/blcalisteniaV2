import { Pressable } from "react-native"
import { useAppTheme } from "@/themes"
import { IconNotification } from "./components/IconNotification"
import { Icon as IconType } from "./IconTypes"
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
import { IconLeftArrow } from "./components/IconLeftArrow"

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
	leftArrow: IconLeftArrow,
}

export const Icon = ({
	name,
	size,
	variant = "default",
	onPress,
	pressableStyle,
}: IconType.Props) => {
	const IconComponent = IconMap[name]
	const { theme } = useAppTheme()

	const variants: Record<IconType.VariantKey, { color: string }> = {
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
