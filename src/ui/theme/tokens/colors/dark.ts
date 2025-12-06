import { primitives } from "./primitives"
import { ThemeType } from "../../types"

export const dark: ThemeType = {
	mode: "dark",
	surface: {
		background: primitives.black,
	},
	content: {
		["text-default"]: primitives.white,
	},
	action: {
		"brand-primary": primitives.orange,
	},
}
