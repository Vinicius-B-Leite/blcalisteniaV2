import { TextProps as RNTextProps } from "react-native"
import { variantsKeys } from "./Text"

export namespace Text {
	export type VariantsKeys = keyof typeof variantsKeys
	export type Props = RNTextProps & {
		variant: VariantsKeys
	}
}
