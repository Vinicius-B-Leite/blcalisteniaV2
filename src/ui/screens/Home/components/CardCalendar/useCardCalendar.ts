import { IconType } from "@/components/core"
import { EWorkoutStatus } from "./types"

export const useCardCalendar = () => {
	const currentDay = new Date().getDate()
	const leftDays = Array.from({ length: currentDay - 1 }, (_, i) => {
		const date = new Date()
		date.setDate(currentDay - i - 1)
		return date.getDate().toString()
	})
	const rightDays = Array.from({ length: 7 - currentDay }, (_, i) => {
		const date = new Date()
		date.setDate(currentDay + i + 1)
		return date.getDate().toString()
	})
	const currentWeekDaysNumber = [
		...leftDays.reverse(),
		currentDay.toString(),
		...rightDays,
	]

	const weekDaysNames = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

	const currentDayActive = new Date().getDate()

	let workoutStatus: EWorkoutStatus = EWorkoutStatus.empty

	const isCurrentDay = (day: string) => {
		return day === currentDayActive.toString()
	}

	const handleWorkoutStatus = () => {
		let title = ""
		let iconName: IconType.Names = "dumbbells"
		let onPress: (() => void) | undefined = undefined

		if (workoutStatus === EWorkoutStatus.empty) {
			title = "Criar treino"
			iconName = "dumbbells"
			onPress = () => {
				// Lógica para criar treino
			}
			return { title, iconName, onPress }
		}

		if (workoutStatus === EWorkoutStatus.start) {
			title = "Continuar treino"
			iconName = "play"
			onPress = () => {
				// Lógica para continuar treino
			}
			return { title, iconName, onPress }
		}

		if (workoutStatus === EWorkoutStatus.resume) {
			title = "Retomar treino"
			iconName = "return"
			onPress = () => {
				// Lógica para retomar treino
			}
			return { title, iconName, onPress }
		}

		if (workoutStatus === EWorkoutStatus.finished) {
			title = "Ver detalhes"
			iconName = "notes"
			onPress = undefined
			return { title, iconName, onPress }
		}

		return { title, iconName, onPress }
	}

	return {
		states: {
			currentWeekDaysNumber,
			weekDaysNames,
		},
		actions: {
			isCurrentDay,
			handleWorkoutStatus,
		},
	}
}
