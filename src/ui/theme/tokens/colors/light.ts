import { primitives } from "./primitives"
import { ThemeType } from "../../types"

export const light: ThemeType = {
	mode: "light",

	surface: {
		background: primitives.white,
	},
	content: {
		["text-default"]: primitives.gray,
		"icon-default": primitives.gray,
	},
	action: {
		"brand-primary": primitives.orange,
	},
	border: {
		default: primitives.gray,
	},
}
