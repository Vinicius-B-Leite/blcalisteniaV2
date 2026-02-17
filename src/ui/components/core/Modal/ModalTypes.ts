import { PropsWithChildren } from "react"
import { ModalProps, ViewProps } from "react-native"

export namespace Modal {
	export type RootProps = PropsWithChildren<{
		visible: boolean
		onClose: () => void
		animationType?: ModalProps["animationType"]
	}>

	export type TitleProps = PropsWithChildren

	export type ContextType = {
		onClose: () => void
	}

	export type ContentProps = PropsWithChildren<ViewProps>
}
