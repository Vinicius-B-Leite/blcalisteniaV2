import React from "react"
import { Text as RNText, TextStyle as RNTextStyle } from "react-native"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { font } from "../../../theme/tokens/font"
import { Text as TextTypes } from "./TextTypes"

const variantsKeys = {
	heading: "heading",
	["body-large-regular"]: "body-large-regular",
	["title-small-bold"]: "title-small-bold",
}

export const Text = ({ children, variant, style, ...rest }: TextTypes.Props) => {
	const { theme } = useAppTheme()

	const variants: Record<keyof typeof variantsKeys, RNTextStyle> = {
		heading: {
			fontWeight: font.weight[700],
			fontSize: font.size[24],
			lineHeight: font.lineHeight[32],
			letterSpacing: font.letterSpacing["-0.12"],
			fontFamily: font.family.default,
			color: theme.content["text-default"],
		},
		"body-large-regular": {
			fontWeight: font.weight[400],
			fontSize: font.size[14],
			lineHeight: font.lineHeight[20],
			letterSpacing: font.letterSpacing["0"],
			fontFamily: font.family.default,
			color: theme.content["text-default"],
		},
		"title-small-bold": {
			fontWeight: font.weight[700],
			fontSize: font.size[14],
			lineHeight: font.lineHeight[24],
			letterSpacing: font.letterSpacing["0"],
			fontFamily: font.family.default,
			color: theme.content["text-default"],
		},
	}

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
