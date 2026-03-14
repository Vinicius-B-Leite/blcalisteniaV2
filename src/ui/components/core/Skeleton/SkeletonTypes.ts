import { StyleProp, ViewProps, ViewStyle } from "react-native"

export namespace Skeleton {
	export type Props = ViewProps & {
		rounded?: boolean
		width?: number | string
		height?: number | string
		style?: StyleProp<ViewStyle>
	}
}
