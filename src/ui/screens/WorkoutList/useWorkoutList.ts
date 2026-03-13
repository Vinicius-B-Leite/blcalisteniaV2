import { useState } from "react"
import { useRouter } from "expo-router"
import {
	useGetWorkouts,
	WorkoutModel,
	useCreateWorkout,
	useDeleteWorkout,
} from "@/domains/Workout"
import { WorkoutFormValues } from "@/components/molecules"
import { useForm } from "react-hook-form"
import { workoutBannerUtils } from "@/utils"

export const useWorkoutList = () => {
	const router = useRouter()

	const {
		workouts,
		isLoading: isGettingWorkouts,
		refetch: refetchWorkoutList,
		isRefetching: isRefetchingWorkouts,
	} = useGetWorkouts()
	const createWorkout = useCreateWorkout()
	const deleteWorkout = useDeleteWorkout()

	const [modalCreateWorkout, setModalCreateWorkout] = useState(false)

	const [deleteModal, setDeleteModal] = useState<WorkoutModel | null>(null)
	const hasWorkouts = workouts.length > 0

	const form = useForm({
		defaultValues: {
			searchText: "",
		},
	})

	const handleOpenWorkout = (id: string) => {
		router.push({
			pathname: "/(application)/workout/[workoutId]",
			params: { workoutId: id },
		})
	}

	const handleOpenModalCreateWorkout = () => {
		setModalCreateWorkout(true)
	}

	const handleCloseModalCreateWorkout = () => {
		setModalCreateWorkout(false)
	}

	const handleEditWorkout = (id: string) => {
		console.log("Edit workout:", id)
	}

	const handleDeleteWorkout = (id: string) => {
		const workout = workouts.filter((w) => w.id === id)[0]
		if (workout) {
			setDeleteModal(workout)
		}
	}

	const handleConfirmDelete = () => {
		if (deleteModal && deleteModal.id) {
			deleteWorkout.execute(deleteModal.id)
		}
		handleCloseDeleteModal()
	}

	const handleCloseDeleteModal = () => {
		setDeleteModal(null)
	}

	const handleConfirmCreateWorkout = (values: WorkoutFormValues) => {
		createWorkout.execute({
			category: values.type,
			title: values.name,
			description: values.description,
			weekDaysFrequency: values.weekDays,
			imageUrl: workoutBannerUtils.getRandomWorkoutBanner(),
		})
	}

	const searchText = form.watch("searchText")
	const filteredWorkouts = workouts.filter((workout) =>
		workout.title.toLowerCase().includes(searchText.toLowerCase()),
	)

	return {
		form,
		states: {
			modalCreateWorkout,
			workouts: filteredWorkouts,
			hasWorkouts,
			deleteModal,
			isDeleting: deleteWorkout.isLoading,
			isGettingWorkouts,
			isRefetchingWorkouts,
		},
		actions: {
			openModal: handleOpenModalCreateWorkout,
			onOpenWorkout: handleOpenWorkout,
			closeModal: handleCloseModalCreateWorkout,
			onEditWorkout: handleEditWorkout,
			onDeleteWorkout: handleDeleteWorkout,
			onConfirmDelete: handleConfirmDelete,
			onCloseDeleteModal: handleCloseDeleteModal,
			onConfirmCreateWorkout: handleConfirmCreateWorkout,
			onRefresh: refetchWorkoutList,
		},
	}
}
