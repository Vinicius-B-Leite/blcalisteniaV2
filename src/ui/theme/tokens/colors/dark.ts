import { primitives } from "./primitives"
import { ThemeType } from "../../types"

export const dark: ThemeType = {
	mode: "dark",
	surface: {
		background: primitives.neutral01,
		container: primitives.neutral10,
		"always-white": primitives.neutral100,
		error: primitives.red50,
		success: primitives.green50,
		caution: primitives.yellow50,
		container2: primitives.neutral0,
		brand: primitives.brandSecondary50,
		"brand-opacity-10": primitives.brandSecondary50Opacity10,
		"brand-opacity-20": primitives.brandSecondary50Opacity20,
		"container-variant": primitives.neutral60,
	},
	content: {
		"text-brand": primitives.brandSecondary50,
		"always-white": primitives.neutral100,
		"text-default": primitives.neutral100,
		"text-error": primitives.red50,
		"text-caution": primitives.yellow50,
		"text-success": primitives.green50,
		"icon-default": primitives.neutral100,
		"icon-brand": primitives.brandSecondary50,
		"text-on-brand": primitives.neutral100,
		"text-variant": primitives.neutral60,
		"icon-always-white": primitives.neutral100,
		"icon-variant": primitives.neutral60,
		"text-caution2": primitives.brandSecondary60,
	},
	border: {
		default: primitives.neutral20,
		success: primitives.green50,
		caution: primitives.yellow50,
		error: primitives.red50,
		"default-dim": primitives.neutral10,
	},
	action: {
		"brand-background": primitives.brandSecondary50,
		"disabled-background": primitives.neutral60,
		"pressed-background": primitives.red50,
	},
	accent: {
		error: primitives.red50,
		success: primitives.green50,
		caution: primitives.yellow50,
		"always-white": primitives.neutral100,
		caution2: primitives.brandSecondary60,
	},
}
