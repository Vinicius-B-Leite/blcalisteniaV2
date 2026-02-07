import { PropsWithChildren } from "react"
import { Text } from "../Text/Text"
import { useButtonContext } from "./ButtonContext"

export const ButtonContent = ({ children }: PropsWithChildren) => {
	const { variant } = useButtonContext()
	return <Text {...variant.content}>{children}</Text>
}
