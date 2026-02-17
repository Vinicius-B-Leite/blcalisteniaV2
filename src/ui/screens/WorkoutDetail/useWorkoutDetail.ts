import { useState } from "react"

export const useWorkoutDetail = () => {
	const [isAddExerciseModalVisible, setIsAddExerciseModalVisible] = useState(false)

	const handleEditPress = () => {
		console.log("Edit workout")
	}

	const handleExercisePress = (id: string) => {
		console.log("Exercise pressed:", id)
	}

	const handleExerciseEditPress = (id: string) => {
		console.log("Exercise edit pressed:", id)
	}

	const handleExerciseDeletePress = (id: string) => {
		console.log("Exercise delete pressed:", id)
	}

	const handleStartWorkout = () => {
		console.log("Start workout")
	}

	const handleAddExercise = () => {
		setIsAddExerciseModalVisible(true)
	}

	const handleCloseAddExerciseModal = () => {
		setIsAddExerciseModalVisible(false)
	}

	return {
		actions: {
			handleEditPress,
			handleExercisePress,
			handleExerciseEditPress,
			handleExerciseDeletePress,
			handleStartWorkout,
			handleAddExercise,
			handleCloseAddExerciseModal,
		},
		state: {
			isAddExerciseModalVisible,
		},
	}
}
