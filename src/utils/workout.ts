import { WeekDaysFrequency } from "src/domain/Workout/WorkoutModel"

const DAY_LABELS: Record<WeekDaysFrequency, string> = {
	0: "Dom",
	1: "Seg",
	2: "Ter",
	3: "Qua",
	4: "Qui",
	5: "Sex",
	6: "Sáb",
}

const getWeekDayLabel = (day: WeekDaysFrequency): string => {
	return DAY_LABELS[day]
}

const getWeekDayLabels = (days: WeekDaysFrequency[]): string[] => {
	return days.map(getWeekDayLabel)
}

export const workoutUtils = {
	getWeekDayLabel,
	getWeekDayLabels,
}
