export type Category = "strength" | "mobility" | "resistance" | "flexibility"

export const CATEGORIES: Record<Category, Category> = {
	strength: "strength",
	mobility: "mobility",
	resistance: "resistance",
	flexibility: "flexibility",
}

export const CATEGORY_LABELS: Record<Category, string> = {
	strength: "Força",
	mobility: "Mobilidade",
	resistance: "Resistência",
	flexibility: "Flexibilidade",
}
