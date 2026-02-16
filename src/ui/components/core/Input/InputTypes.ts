import { PropsWithChildren, RefObject } from "react"
import {
	StyleProp,
	TextInput,
	TextInputProps,
	TextStyle,
	ViewProps,
	ViewStyle,
} from "react-native"
import { Text } from "../Text/TextTypes"
import { inputVariantsKeys } from "./InputVariants"

export namespace Input {
	export type VariantsKeys = keyof typeof inputVariantsKeys

	export type Variant = {
		container: StyleProp<ViewStyle>
		label?: {
			variant: "body-large-bold"
			style?: StyleProp<TextStyle>
		}
		field: {
			container: StyleProp<ViewStyle>
			input: StyleProp<TextStyle>
		}
	}

	export type RootProps = PropsWithChildren<
		ViewProps & {
			variant?: VariantsKeys
		}
	>

	export type LabelProps = PropsWithChildren<Partial<Text.Props>>

	export type FieldWrapperProps = PropsWithChildren<ViewProps>

	export type FieldProps = TextInputProps

	export type ContextType = {
		variant: Variant
		inputRef: RefObject<TextInput | null>
	}
}
