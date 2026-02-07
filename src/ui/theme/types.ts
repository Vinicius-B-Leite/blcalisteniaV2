export type ThemeType = {
	surface: {
		background: string
		"brand-opacity-10": string
		container: string
		brand: string
	}
	content: {
		["text-default"]: string
		["icon-default"]: string
	}
	action: {
		["brand-primary"]: string
	}
	border: {
		default: string
	}
	mode: ThemeMode
}

export type ThemeMode = "light" | "dark"
