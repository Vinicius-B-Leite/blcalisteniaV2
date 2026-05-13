import { useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useForm } from "react-hook-form"
import { MuscleGroup } from "@/constants"
import { ExerciseModel, useGetExercises, useDeleteExercise } from "@/domains/Exercise"

import { useDebounceValue } from "@/hooks"
import { useAddWorkoutExerciseContext } from "@/providers/addWorkoutExercise"
import { useAuth } from "@/domains/Auth"

export const useSearchExercises = () => {
	const router = useRouter()

	const params = useLocalSearchParams<{ workoutId: string }>()
	const workoutId = params?.workoutId

	const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<null | MuscleGroup>(
		null,
	)
	const [onlyCustom, setOnlyCustom] = useState(false)
	const [selectedExercise, setSelectedExercise] = useState<ExerciseModel | null>(null)
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
	const [editingExercise, setEditingExercise] = useState<ExerciseModel | null>(null)
	const [selectedExerciseToDelete, setSelectedExerciseToDelete] =
		useState<ExerciseModel | null>(null)

	const form = useForm({
		defaultValues: {
			searchText: "",
		},
	})

	const searchText = form.watch("searchText")
	const debouncedSearchText = useDebounceValue(searchText)

	const { addWorkoutExercise } = useAddWorkoutExerciseContext()
	const { auth } = useAuth()

	const { exercises, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useGetExercises({
			searchText: debouncedSearchText,
			muscleGroup: selectedMuscleGroup ?? undefined,
			onlyCustom,
		})

	const { execute: deleteExercise, isLoading: isDeletingExercise } = useDeleteExercise()

	const isCustomExercise = (exercise: ExerciseModel) =>
		exercise.userId !== null && exercise.userId === auth?.id

	const handleGoBack = () => {
		router.back()
	}

	const handleMuscleGroupSelect = (muscleGroup: MuscleGroup) => {
		const alreadySelected = selectedMuscleGroup === muscleGroup
		if (alreadySelected) {
			return setSelectedMuscleGroup(null)
		}
		setSelectedMuscleGroup(muscleGroup)
	}

	const toggleOnlyCustom = () => {
		setOnlyCustom((prev) => !prev)
	}

	const handleExercisePress = (id: string) => {
		console.log("Exercise pressed:", id)
	}

	const handleFavoritePress = (id: string) => {
		console.log("Favorite pressed:", id)
	}

	const handleToggleExercise = (exercise: ExerciseModel | null) => {
		setSelectedExercise((prev) => {
			if (prev?.id === exercise?.id) {
				return null
			}
			return exercise
		})
	}

	const handleAddExercises = () => {
		if (!selectedExercise) return
		addWorkoutExercise(selectedExercise)
		handleGoBack()
	}

	const handleOpenCreateModal = () => {
		setEditingExercise(null)
		setIsCreateModalVisible(true)
	}

	const handleOpenEditModal = (exercise: ExerciseModel) => {
		setEditingExercise(exercise)
		setIsCreateModalVisible(true)
	}

	const handleCloseModal = () => {
		setIsCreateModalVisible(false)
		setEditingExercise(null)
	}

	const handleOpenDeleteModal = (exercise: ExerciseModel) => {
		setSelectedExerciseToDelete(exercise)
	}

	const handleCloseDeleteModal = () => {
		setSelectedExerciseToDelete(null)
	}

	const handleConfirmDelete = async () => {
		if (!selectedExerciseToDelete || isDeletingExercise) return
		const exerciseId = selectedExerciseToDelete.id
		try {
			await deleteExercise(exerciseId)
			handleCloseDeleteModal()
			setSelectedExercise((prev) => (prev?.id === exerciseId ? null : prev))
		} catch {
			handleCloseDeleteModal()
		}
	}

	const onEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}

	return {
		form,
		states: {
			searchText,
			selectedMuscleGroup,
			onlyCustom,
			exercises,
			selectedExercise,
			isLoading,
			isFetchingNextPage,
			hasNextPage,
			isCreateModalVisible,
			editingExercise,
			selectedExerciseToDelete,
			isDeletingExercise,
			isCustomExercise,
			hasActiveFilter: debouncedSearchText !== "" || selectedMuscleGroup !== null,
		},
		actions: {
			handleGoBack,
			handleMuscleGroupSelect,
			toggleOnlyCustom,
			handleExercisePress,
			handleFavoritePress,
			handleToggleExercise,
			handleAddExercises,
			handleOpenCreateModal,
			handleOpenEditModal,
			handleCloseModal,
			handleOpenDeleteModal,
			handleCloseDeleteModal,
			handleConfirmDelete,
			onEndReached,
			fetchNextPage,
		},
	}
}
