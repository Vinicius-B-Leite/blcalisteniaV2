import { TextStyle } from "react-native"

const fontSize = {
	10: 10,
	12: 12,
	14: 14,
	16: 16,
	18: 18,
	22: 22,
	24: 24,
}

const lineHeight = {
	14: 14,
	32: 32,
	20: 20,
	24: 24,
	28: 28,
	16: 16,
}

const fontWeight: Record<string, TextStyle["fontWeight"]> = {
	700: "700",
	400: "400",
}

const letterSpacing = {
	0: 0,
	"0.05": 0.05,
	"0.06": 0.06,
	"-0.90": -0.9,
	"-0.12": -0.12,
	"-0.11": -0.12,
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
