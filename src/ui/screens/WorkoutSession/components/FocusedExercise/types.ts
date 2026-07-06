import { WorkoutExerciseSetModel } from "@/domains/WorkoutExerciseSet"
import { PropsWithChildren } from "react"

export type FocusedExerciseProps = {
	exerciseName: string
	muscleGroupLabel: string
	sets: WorkoutExerciseSetModel[]
	exerciseCount: number
}

export type SummaryProps = {
	exerciseName: string
	muscleGroupLabel: string
	exerciseCount: number
	activeExerciseIndex: number
}

export type SerieItemProps = {
	serie: number
	reps: number
	hasNext?: boolean
	hasManySets: boolean
}

export type ExerciseContainerProps = PropsWithChildren<{
	hasManySets: boolean
}>
