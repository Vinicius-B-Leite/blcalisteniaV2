import { primitives } from "./primitives"
import { ThemeType } from "@/themes"

export const light: ThemeType = {
	mode: "light",
	surface: {
		background: primitives.neutral100,
		container: primitives.neutral90,
		"always-white": primitives.neutral100,
		error: primitives.red50,
		success: primitives.green50,
		caution: primitives.yellow50,
		container2: primitives.neutral80,
		brand: primitives.brandPrimary50,
		"brand-opacity-10": primitives.brandPrimary50Opacity10,
		"brand-opacity-20": primitives.brandPrimary50Opacity20,
		"container-variant": primitives.neutral60,
	},
	content: {
		"text-brand": primitives.brandPrimary50,
		"always-white": primitives.neutral100,
		"text-default": primitives.neutral30,
		"text-error": primitives.red50,
		"text-caution": primitives.yellow50,
		"text-success": primitives.green50,
		"icon-default": primitives.neutral30,
		"icon-brand": primitives.brandPrimary50,
		"text-on-brand": primitives.neutral100,
		"text-variant": primitives.neutral60,
		"icon-always-white": primitives.neutral100,
		"icon-variant": primitives.neutral60,
		"text-caution2": primitives.brandSecondary60,
	},
	border: {
		default: primitives.neutral80,
		success: primitives.green50,
		caution: primitives.yellow50,
		error: primitives.red50,
		"default-dim": primitives.neutral70,
	},
	action: {
		"brand-background": primitives.brandPrimary50,
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
