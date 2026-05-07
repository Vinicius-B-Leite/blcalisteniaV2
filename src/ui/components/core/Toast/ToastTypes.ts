import { ReactNode } from "react"
import { ViewStyle } from "react-native"
import { Text } from "../Text/TextTypes"
import { toastVariantsKeys } from "./ToastVariants"

export namespace Toast {
	export type VariantsKeys = keyof typeof toastVariantsKeys

	export type Variant = {
		container: ViewStyle
		message: Text.Props
	}

	export type ShowProps = {
		message: string
		variant: VariantsKeys
		left?: ReactNode
		right?: ReactNode
		duration?: number
	}

	export type Handle = {
		show: (props: ShowProps) => void
		hide: () => void
	}

	export type ContextType = {
		variant: Variant
		props: ShowProps
	}
}
