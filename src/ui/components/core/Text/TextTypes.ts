import { TextProps as RNTextProps } from "react-native"
import { textVariantsKeys } from "./TextVariants"

export namespace Text {
	export type VariantsKeys = keyof typeof textVariantsKeys
	export type Props = RNTextProps & {
		variant: VariantsKeys
	}
}
