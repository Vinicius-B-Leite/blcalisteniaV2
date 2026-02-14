import { PropsWithChildren } from "react"
import { ScrollViewProps } from "react-native"

export namespace Screen {
	export type Props = PropsWithChildren<{
		scrollable?: boolean
	}> &
		ScrollViewProps
}
