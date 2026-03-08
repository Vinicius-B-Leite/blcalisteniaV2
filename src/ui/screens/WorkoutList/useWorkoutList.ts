import { useState } from "react"
import { useRouter } from "expo-router"
import { useGetWorkouts } from "src/domain/Workout/useCases/useGetWorkouts"
import { WorkoutModel } from "src/domain/Workout/WorkoutModel"
import { WorkoutFormValues } from "@/components/containers/WorkoutFormModal/WorkoutFormModal"

export const useWorkoutList = () => {
	const router = useRouter()
	const [modalCreateWorkout, setModalCreateWorkout] = useState(false)
	const [searchText, setSearchText] = useState("")
	const { workouts, isLoading } = useGetWorkouts()
	const [deleteModal, setDeleteModal] = useState<WorkoutModel | null>(null)

	const hasWorkouts = workouts.length > 0

	const handleOpenWorkout = (id: string) => {
		router.push("/(application)/(workoutDetail)")
		// TODO: Pass workout ID as parameter when implementing dynamic routes
	}

	const handleOpenModalCreateWorkout = () => {
		setModalCreateWorkout(true)
	}

	const handleCloseModalCreateWorkout = () => {
		setModalCreateWorkout(false)
	}

	const handleSearchTextChange = (text: string) => {
		setSearchText(text)
	}

	const handleEditWorkout = (id: string) => {
		console.log("Edit workout:", id)
		// TODO: Implement edit functionality
	}

	const handleDeleteWorkout = (id: string) => {
		const workout = workouts.find((w) => w.id === id)
		if (workout) {
			setDeleteModal(workout)
		}
	}

	const handleConfirmDelete = () => {
		if (deleteModal && deleteModal.id) {
			console.log("Delete workout:", deleteModal.id)
		}
		handleCloseDeleteModal()
	}

	const handleCloseDeleteModal = () => {
		setDeleteModal(null)
	}

	const handleConfirmCreateWorkout = (values: WorkoutFormValues) => {
		console.log("Create workout with values:", values)
	}
	const filteredWorkouts = workouts.filter((workout) =>
		workout.title.toLowerCase().includes(searchText.toLowerCase()),
	)

	return {
		states: {
			modalCreateWorkout,
			searchText,
			workouts: filteredWorkouts,
			hasWorkouts,
			deleteModal,
		},
		actions: {
			openModal: handleOpenModalCreateWorkout,
			onOpenWorkout: handleOpenWorkout,
			closeModal: handleCloseModalCreateWorkout,
			onSearchTextChange: handleSearchTextChange,
			onEditWorkout: handleEditWorkout,
			onDeleteWorkout: handleDeleteWorkout,
			onConfirmDelete: handleConfirmDelete,
			onCloseDeleteModal: handleCloseDeleteModal,
			onConfirmCreateWorkout: handleConfirmCreateWorkout,
		},
	}
}
