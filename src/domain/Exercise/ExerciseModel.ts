import { MuscleGroup } from "@/constants"

export type ExerciseModel = {
	id: string
	name: string
	musclesGroups: MuscleGroup[]
	bannerUrl?: string | null
	userId: string | null
}
