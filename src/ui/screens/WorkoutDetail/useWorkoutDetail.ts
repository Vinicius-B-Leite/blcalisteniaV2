import { useState } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useGetWorkoutById } from "@/domains/Workout"

export const useWorkoutDetail = () => {
	const router = useRouter()
	const params = useLocalSearchParams<{ workoutId: string }>()
	const { workout, isLoading } = useGetWorkoutById({
		id: params.workoutId,
		onError: () => router.back(),
	})

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
		if (workout?.id) {
			router.push({
				pathname: `/(application)/workout/[workoutId]/chooseImage`,
				params: { workoutId: workout.id },
			})
		}
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
			workout,
			isLoading,
		},
	}
}
