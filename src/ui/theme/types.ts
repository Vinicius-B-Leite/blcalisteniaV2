export type ThemeType = {
	surface: {
		background: string
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
