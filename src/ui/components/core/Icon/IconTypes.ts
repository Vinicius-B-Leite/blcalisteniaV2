import { PressableProps, ViewStyle } from "react-native"
import { IconMap } from "./Icon"

const variantsKey = {
	default: "default",
}

export namespace Icon {
	export type VariantKey = keyof typeof variantsKey
	export type Names = keyof typeof IconMap
	export type Props = {
		name: Names
		size: number
		variant?: VariantKey
		onPress?(): void
		pressableStyle?: ViewStyle
	}
	export type IconMapProp = {
		size: number
		color: string
	}
}
