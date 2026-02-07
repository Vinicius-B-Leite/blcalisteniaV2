import { PressableProps, StyleProp, ViewStyle } from "react-native"

export namespace Pressable {
	export type RootProps = PressableProps & {
		style?: StyleProp<ViewStyle>
		scaleOnPress?: number
		opacityOnPress?: number
	}
	export type ContextType = {
		scaleOnPress: number
		opacityOnPress: number
	}
}
