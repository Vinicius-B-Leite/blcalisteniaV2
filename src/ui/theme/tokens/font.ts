import { TextStyle } from "react-native"

const fontSize = {
	24: 24,
	14: 14,
	16: 16,
}

const lineHeight = {
	32: 32,
	20: 20,
	24: 24,
}

const fontWeight: Record<string, TextStyle["fontWeight"]> = {
	700: "700",
	400: "400",
}

const letterSpacing = {
	0: 0,
	"-0.12": -0.12,
}

const fontFamily = {
	default: "System",
}

export const font = {
	size: fontSize,
	lineHeight: lineHeight,
	weight: fontWeight,
	letterSpacing: letterSpacing,
	family: fontFamily,
}
export type FontType = typeof font
