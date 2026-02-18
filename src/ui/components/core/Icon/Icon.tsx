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
import { IconX } from "./components/IconX"
import { IconTrash } from "./components/IconTrash"
import { IconSearch } from "./components/IconSearch"
import { IconEdit } from "./components/IconEdit"
import { Pressable } from "../Pressable"
import { IconPlus } from "./components/IconPlus"
import { IconAttach } from "./components/IconAttach"

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
	x: IconX,
	trash: IconTrash,
	search: IconSearch,
	edit: IconEdit,
	plus: IconPlus,
	attach: IconAttach,
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
		secondary: {
			color: theme.content["icon-variant"],
		},
		error: {
			color: theme.content["text-error"],
		},
		brand: {
			color: theme.surface.brand,
		},
	}

	const currentVariant = variants[variant]

	if (onPress) {
		console.log("onPress provided for icon:", name)
		return (
			<Pressable.Root onPress={onPress} style={pressableStyle} hitSlop={12}>
				<IconComponent color={currentVariant.color} size={size} />
			</Pressable.Root>
		)
	}

	return <IconComponent color={currentVariant.color} size={size} />
}
