import { TextStyle } from "react-native"
import { FontType, interFontFamilyNames } from "../tokens"

type WeightKeys = keyof FontType["weight"]

const fontFamilyMapWeight: Record<WeightKeys, keyof typeof interFontFamilyNames> = {
	"400": "Inter-Regular",
	"700": "Inter-Bold",
}
export const resolveFontWeight = (weight: WeightKeys): TextStyle["fontFamily"] => {
	return fontFamilyMapWeight[weight as WeightKeys] || fontFamilyMapWeight["400"]
}
