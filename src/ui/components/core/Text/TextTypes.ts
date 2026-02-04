import { TextProps as RNTextProps } from "react-native"

const variantsKeys = {
	heading: "heading",
	["body-large-regular"]: "body-large-regular",
	["title-small-bold"]: "title-small-bold",
}

export namespace Text {
	export type VariantsKeys = keyof typeof variantsKeys
	export type Props = RNTextProps & {
		variant: VariantsKeys
	}
}
