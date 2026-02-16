import React from "react"
import { Text as RNText } from "react-native"
import { useAppTheme } from "@/themes"
import { Text as TextTypes } from "./TextTypes"
import { textVariants } from "./TextVariants"

export const Text = ({ children, variant, style, ...rest }: TextTypes.Props) => {
	const { theme } = useAppTheme()

	const variants = textVariants(theme)

	return (
		<RNText
			style={[
				{
					color: theme.content["text-default"],
					...(variant ? variants[variant] : {}),
				},
				style,
			]}
			{...rest}>
			{children}
		</RNText>
	)
}
