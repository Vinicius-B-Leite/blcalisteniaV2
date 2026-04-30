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
	"-0.11": -0.11,
}

export const interFontFamilyNames = {
	"Inter-Black": "Inter-Black",
	"Inter-BlackItalic": "Inter-BlackItalic",
	"Inter-Bold": "Inter-Bold",
	"Inter-BoldItalic": "Inter-BoldItalic",
	"Inter-ExtraBold": "Inter-ExtraBold",
	"Inter-ExtraBoldItalic": "Inter-ExtraBoldItalic",
	"Inter-ExtraLight": "Inter-ExtraLight",
	"Inter-ExtraLightItalic": "Inter-ExtraLightItalic",
	"Inter-Italic": "Inter-Italic",
	"Inter-Light": "Inter-Light",
	"Inter-LightItalic": "Inter-LightItalic",
	"Inter-Medium": "Inter-Medium",
	"Inter-MediumItalic": "Inter-MediumItalic",
	"Inter-Regular": "Inter-Regular",
	"Inter-SemiBold": "Inter-SemiBold",
	"Inter-SemiBoldItalic": "Inter-SemiBoldItalic",
	"Inter-Thin": "Inter-Thin",
	"Inter-ThinItalic": "Inter-ThinItalic",
}

const fontFamily = {
	default: "System",
	inter: "Inter-Regular",
	...interFontFamilyNames,
}

export const font = {
	size: fontSize,
	lineHeight: lineHeight,
	weight: fontWeight,
	letterSpacing: letterSpacing,
	family: fontFamily,
}
export type FontType = typeof font
