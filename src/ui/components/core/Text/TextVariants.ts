import { TextStyle as RNTextStyle } from "react-native"
import { font } from "@/themes"
import type { ThemeType } from "@/themes"

export const textVariantsKeys = {
	heading: "heading",
	title: "title",
	"title-small-reg": "title-small-reg",
	["title-large-bold"]: "title-large-bold",
	["body-large-regular"]: "body-large-regular",
	["title-small-bold"]: "title-small-bold",
	["body-large-bold"]: "body-large-bold",
	["body-small-reg"]: "body-small-reg",
	["body-small-bold"]: "body-small-bold",
	["caption-reg"]: "caption-reg",
}

export const textVariants = (
	theme: ThemeType,
): Record<keyof typeof textVariantsKeys, RNTextStyle> => {
	const defaultVariant: RNTextStyle = {
		fontFamily: font.family.default,
		color: theme.content["text-default"],
	}

	return {
		heading: {
			...defaultVariant,
			fontWeight: font.weight[700],
			fontSize: font.size[24],
			lineHeight: font.lineHeight[32],
			letterSpacing: font.letterSpacing["-0.12"],
		},
		title: {
			...defaultVariant,
			fontWeight: font.weight[700],
			fontSize: font.size[22],
			lineHeight: font.lineHeight[28],
			letterSpacing: font.letterSpacing["-0.11"],
		},
		"title-large-bold": {
			...defaultVariant,
			fontWeight: font.weight[700],
			fontSize: font.size[18],
			lineHeight: font.lineHeight[24],
			letterSpacing: font.letterSpacing["-0.90"],
		},
		"body-large-regular": {
			...defaultVariant,
			fontWeight: font.weight[400],
			fontSize: font.size[14],
			lineHeight: font.lineHeight[20],
			letterSpacing: font.letterSpacing["0"],
		},
		"body-large-bold": {
			...defaultVariant,
			fontWeight: font.weight[700],
			fontSize: font.size[14],
			lineHeight: font.lineHeight[20],
			letterSpacing: font.letterSpacing["0"],
		},
		"title-small-bold": {
			...defaultVariant,
			fontWeight: font.weight[700],
			fontSize: font.size[14],
			lineHeight: font.lineHeight[24],
			letterSpacing: font.letterSpacing["0"],
		},
		"title-small-reg": {
			...defaultVariant,
			fontWeight: font.weight[400],
			fontSize: font.size[16],
			lineHeight: font.lineHeight[24],
			letterSpacing: font.letterSpacing["0"],
		},
		"body-small-reg": {
			...defaultVariant,
			fontWeight: font.weight[400],
			fontSize: font.size[12],
			lineHeight: font.lineHeight[16],
			letterSpacing: font.letterSpacing["0.06"],
		},
		"body-small-bold": {
			...defaultVariant,
			fontWeight: font.weight[700],
			fontSize: font.size[12],
			lineHeight: font.lineHeight[16],
			letterSpacing: font.letterSpacing["0.06"],
		},
		"caption-reg": {
			...defaultVariant,
			fontWeight: font.weight[400],
			fontSize: font.size[10],
			lineHeight: font.lineHeight[14],
			letterSpacing: font.letterSpacing["0.05"],
		},
	}
}
