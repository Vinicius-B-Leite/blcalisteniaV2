import { useEffect, useState } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useGetWorkoutById } from "@/domains/Workout"
import {
	useGetExercisesByWorkout,
	useGetExercisesWithSetsByWorkout,
	useRemoveWorkoutExercise,
} from "@/domains/WorkoutExercise"
import { useAddWorkoutExerciseContext } from "@/providers/addWorkoutExercise"

export const useWorkoutDetail = () => {
	const router = useRouter()
	const params = useLocalSearchParams<{ workoutId: string }>()
	const workoutId = params.workoutId
	const { workout, isLoading } = useGetWorkoutById({
		id: workoutId,
		onError: () => router.back(),
	})

	const { workoutExercises, isLoading: isExercisesLoading } =
		useGetExercisesByWorkout(workoutId)

	const { exercisesWithSets, isLoading: isExercisesWithSetsLoading } =
		useGetExercisesWithSetsByWorkout(workoutId)

	const [isCreateWorkoutModalVisible, setIsCreateWorkoutModalVisible] = useState(false)
	const [isAddExerciseModalVisible, setIsAddExerciseModalVisible] = useState(false)
	const [editModalWorkoutExerciseId, setEditModalWorkoutExerciseId] = useState<
		string | null
	>(null)
	const [deleteModal, setDeleteModal] = useState<{
		workoutExerciseId: string
		exerciseName: string
	} | null>(null)

	const { currentWorkoutExercises } = useAddWorkoutExerciseContext()
	const { execute: removeExercise, isLoading: isRemoveLoading } =
		useRemoveWorkoutExercise()

	const handleEditPress = () => {
		handleOpenEditWorkoutModal()
	}

	const handleExercisePress = (id: string) => {
		console.log("Exercise pressed:", id)
	}

	const handleExerciseEditPress = (workoutExerciseId: string) => {
		setEditModalWorkoutExerciseId(workoutExerciseId)
		setIsAddExerciseModalVisible(true)
	}

	const handleExerciseDeletePress = (
		workoutExerciseId: string,
		exerciseName: string,
	) => {
		setDeleteModal({ workoutExerciseId, exerciseName })
	}

	const handleCloseEditModal = () => {
		setIsAddExerciseModalVisible(false)
		setEditModalWorkoutExerciseId(null)
	}

	const handleCloseDeleteModal = () => {
		setDeleteModal(null)
	}

	const handleConfirmDeleteExercise = async () => {
		try {
			if (!deleteModal) return
			await removeExercise(deleteModal.workoutExerciseId)
			setDeleteModal(null)
		} catch {
			// Error handled via useRemoveWorkoutExercise onError callback
		}
	}

	const handleStartWorkout = () => {
		if (workout?.id) {
			router.push({
				pathname: `/(application)/workout/[workoutId]/session`,
				params: { workoutId: workout.id },
			})
		}
	}

	const handleAddExercise = () => {
		setIsAddExerciseModalVisible(true)
	}

	const handleCloseAddExerciseModal = () => {
		setIsAddExerciseModalVisible(false)
		setEditModalWorkoutExerciseId(null)
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

	const handleOpenAddExerciseModalWhenGoBackFromSearchExercises = () => {
		if (currentWorkoutExercises) {
			setIsAddExerciseModalVisible(true)
		}
	}
	useEffect(() => {
		handleOpenAddExerciseModalWhenGoBackFromSearchExercises()
	}, [currentWorkoutExercises])

	return {
		actions: {
			handleEditPress,
			handleExercisePress,
			handleExerciseEditPress,
			handleExerciseDeletePress,
			handleCloseEditModal,
			handleCloseDeleteModal,
			handleConfirmDeleteExercise,
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
			editModalWorkoutExerciseId,
			deleteModal,
			isRemoveLoading,
			workout,
			isLoading: isLoading || isExercisesLoading || isExercisesWithSetsLoading,
			exercises: exercisesWithSets,
		},
	}
}
