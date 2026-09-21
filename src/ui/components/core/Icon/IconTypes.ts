import { PressableProps, ViewStyle } from "react-native"
import { IconMap } from "./Icon"

const variantsKey = {
	default: "default",
	secondary: "secondary",
	error: "error",
	brand: "brand",
	onBrand: "onBrand",
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
		testID?: string
	}
	export type IconMapProp = {
		size: number
		color: string
		testID?: string
	}
}
