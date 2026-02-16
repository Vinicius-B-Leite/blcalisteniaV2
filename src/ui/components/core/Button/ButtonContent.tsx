import { PropsWithChildren } from "react"
import { Text } from "@/components/core"
import { useButtonContext } from "./ButtonContext"
import { ActivityIndicator } from "react-native"
import { useAppTheme } from "@/themes/hooks"

export const ButtonContent = ({ children }: PropsWithChildren) => {
	const { theme } = useAppTheme()
	const { variant, isLoading } = useButtonContext()

	if (isLoading) {
		return <ActivityIndicator size={24} color={theme.content["always-white"]} />
	}
	return <Text {...variant.content}>{children}</Text>
}
