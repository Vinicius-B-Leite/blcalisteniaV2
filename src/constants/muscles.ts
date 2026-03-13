export const MUSCLES_GROUPS = {
	biceps: "Biceps",
	legs: "legs",
	chest: "chest",
	back: "back",
	core: "core",
	shoulders: "shoulders",
	triceps: "triceps",
}

export type MuscleGroup = keyof typeof MUSCLES_GROUPS

export const MUSCLES_GROUP_LABELS: Record<MuscleGroup, string> = {
	legs: "Pernas",
	back: "Costas",
	chest: "Peitoral",
	core: "Core",
	shoulders: "Ombros",
	biceps: "Bíceps",
	triceps: "Tríceps",
}
