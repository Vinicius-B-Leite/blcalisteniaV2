import { primitives } from "./primitives"
import { ThemeType } from "../../types"

export const dark: ThemeType = {
	mode: "dark",
	surface: {
		background: primitives.black,
		"brand-opacity-10": primitives.orangeOpacity10,
		container: primitives.gray100,
		brand: primitives.orange,
	},
	content: {
		["text-default"]: primitives.white,
		"icon-default": primitives.white,
	},
	action: {
		"brand-primary": primitives.orange,
	},
	border: {
		default: primitives.gray200,
	},
}
