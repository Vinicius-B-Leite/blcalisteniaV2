export type ThemeType = {
	surface: {
		background: string
		container: string
		"always-white": string
		error: string
		success: string
		caution: string
		container2: string
		brand: string
		"brand-opacity-10": string
		"brand-opacity-20": string
		"container-variant": string
	}
	content: {
		"text-brand": string
		"always-white": string
		"text-default": string
		"text-error": string
		"text-caution": string
		"text-success": string
		"icon-default": string
		"icon-brand": string
		"text-on-brand": string
		"text-variant": string
		"icon-always-white": string
		"icon-variant": string
		"text-caution2": string
	}
	border: {
		default: string
		success: string
		caution: string
		error: string
		"default-dim": string
	}
	action: {
		"brand-background": string
		"disabled-background": string
		"pressed-background": string
	}
	accent: {
		error: string
		success: string
		caution: string
		"always-white": string
		caution2: string
	}
	mode: ThemeMode
}

export type ThemeMode = "light" | "dark"
