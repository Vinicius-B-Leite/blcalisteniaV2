import { Category } from "@/constants"

export const weekDaysFrequency = [0, 1, 2, 3, 4, 5, 6] as const
export type WeekDaysFrequency = (typeof weekDaysFrequency)[number]

export type WorkoutModel = {
	id: string
	title: string
	description: string
	category: Category
	imageUrl?: string
	weekDaysFrequency: WeekDaysFrequency[]
	// exercises: Exercise[]
}
