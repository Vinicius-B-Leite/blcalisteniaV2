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
	if (!(day in DAY_LABELS)) {
		return ""
	}
	return DAY_LABELS[day]
}

const getWeekDayLabels = (days: WeekDaysFrequency[]): string[] => {
	if (!days || days.length === 0) {
		return []
	}
	return days.map(getWeekDayLabel)
}

export const workoutUtils = {
	getWeekDayLabel,
	getWeekDayLabels,
}
