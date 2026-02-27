import { useState } from "react"
import { useRouter } from "expo-router"

export const useWorkoutDetail = () => {
	const router = useRouter()
	const [isCreateWorkoutModalVisible, setIsCreateWorkoutModalVisible] = useState(false)
	const [isAddExerciseModalVisible, setIsAddExerciseModalVisible] = useState(false)

	const handleEditPress = () => {
		handleOpenEditWorkoutModal()
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

	const handleNavigateToChangeImage = () => {
		router.push("/(application)/(workoutDetail)/chooseImage")
		handleCloseEditWorkoutModal()
	}

	const handleCloseEditWorkoutModal = () => {
		setIsCreateWorkoutModalVisible(false)
	}

	const handleOpenEditWorkoutModal = () => {
		setIsCreateWorkoutModalVisible(true)
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
			handleNavigateToChangeImage,
			handleCloseEditWorkoutModal,
			handleOpenEditWorkoutModal,
		},
		state: {
			isAddExerciseModalVisible,
			isCreateWorkoutModalVisible,
		},
	}
}
