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
import { useDebounceValue } from "@/hooks"

export const useWorkoutList = () => {
	const router = useRouter()

	const form = useForm({
		defaultValues: {
			searchText: "",
		},
	})

	const currentSearchText = form.watch("searchText")
	const debouncedSearchText = useDebounceValue(currentSearchText)

	const {
		workouts,
		isLoading: isGettingWorkouts,
		refetch: refetchWorkoutList,
		isRefetching: isRefetchingWorkouts,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useGetWorkouts({ searchText: debouncedSearchText })
	const createWorkout = useCreateWorkout()
	const deleteWorkout = useDeleteWorkout({
		onError: () => {
			handleCloseDeleteModal()
		},
	})

	const [modalCreateWorkout, setModalCreateWorkout] = useState(false)

	const [deleteModal, setDeleteModal] = useState<WorkoutModel | null>(null)

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

	const handleConfirmDelete = async () => {
		try {
			if (deleteModal && deleteModal.id) {
				await deleteWorkout.execute(deleteModal.id)
			}
			handleCloseDeleteModal()
		} catch (err) {
			// Error handled via useDeleteWorkout onError callback
		}
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

	const hasWorkouts = workouts.length > 0
	const isSearching = debouncedSearchText.length > 0

	const onEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}

	return {
		form,
		states: {
			modalCreateWorkout,
			workouts,
			hasWorkouts,
			deleteModal,
			isDeleting: deleteWorkout.isLoading,
			isGettingWorkouts,
			isRefetchingWorkouts,
			isSearching,
			isFetchingNextPage,
			hasNextPage,
			debouncedSearchText,
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
			onEndReached,
		},
	}
}
