import { ViewProps } from "react-native"
import { PropsWithChildren } from "react"
import { Text } from "../Text/TextTypes"

export namespace Header {
	export type RootProps = ViewProps
	export type GoBackProps = PropsWithChildren

	export type TitleProps = PropsWithChildren<Partial<Text.Props>>
}
