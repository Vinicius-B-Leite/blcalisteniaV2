import { PropsWithChildren, RefObject } from "react"
import {
	StyleProp,
	TextInput,
	TextInputProps,
	TextStyle,
	ViewProps,
	ViewStyle,
} from "react-native"
import { Control, FieldValues, Path } from "react-hook-form"
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

	export type RootProps<T extends FieldValues = any> = PropsWithChildren<
		ViewProps & {
			variant?: VariantsKeys
			control?: Control<T>
			name: Path<T>
		}
	>

	export type LabelProps = PropsWithChildren<Partial<Text.Props>>

	export type FieldWrapperProps = PropsWithChildren<ViewProps>

	export type FieldProps = TextInputProps

	export type ErrorProps = PropsWithChildren<Partial<Text.Props>>

	export type ContextType<T extends FieldValues = any> = {
		variant: Variant
		inputRef: RefObject<TextInput | null>
		control?: Control<T>
		name: Path<T>
	}
}
