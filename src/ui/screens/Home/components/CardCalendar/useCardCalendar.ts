import { Icon } from "../../../../components/core/Icon/IconTypes"
import { EWorkoutStatus } from "./types"

export const useCardCalendar = () => {
	const currentWeekDaysNumber = Array.from({ length: 7 }, (_, i) => {
		const date = new Date()
		date.setDate(date.getDate() - i)
		return date.getDate().toString()
	}).reverse()

	const weekDaysNames = Array.from({ length: 7 }, (_, i) => {
		const date = new Date()
		date.setDate(date.getDate() - i)
		return date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")
	}).reverse()

	const currentDayActive = new Date().getDate()

	let workoutStatus: EWorkoutStatus = EWorkoutStatus.empty

	const isCurrentDay = (day: string) => {
		return day === currentDayActive.toString()
	}

	const handleWorkoutStatus = () => {
		let title = ""
		let iconName: Icon.Names = "dumbbells"
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
