export type ThemeType = {
	surface: {
		background: string
	}
	content: {
		["text-default"]: string
	}
	action: {
		["brand-primary"]: string
	}
	mode: ThemeMode
}

export type ThemeMode = "light" | "dark"
