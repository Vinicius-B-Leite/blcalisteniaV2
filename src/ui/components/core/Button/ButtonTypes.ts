import { StyleProp, TouchableOpacityProps, ViewStyle } from "react-native"
import { Text } from "../Text/TextTypes"
import { variantsKeys } from "./ButtonRoot"

export namespace Button {
	export type VariantsKeys = keyof typeof variantsKeys
	export type Variant = {
		root: StyleProp<ViewStyle>
		content: Text.Props
	}
	export type RootProps = TouchableOpacityProps & {
		variant: VariantsKeys
	}
	export type ContextType = {
		variant: Variant
	}
}
