import { useState } from "react"

export const useWorkoutList = () => {
	const [modalCreateWorkout, setModalCreateWorkout] = useState(false)

	const handleOpenModalCreateWorkout = () => {
		setModalCreateWorkout(true)
	}

	const handleCloseModalCreateWorkout = () => {
		setModalCreateWorkout(false)
	}

	return {
		states: {
			modalCreateWorkout,
		},
		actions: {
			openModal: handleOpenModalCreateWorkout,
			closeModal: handleCloseModalCreateWorkout,
		},
	}
}
