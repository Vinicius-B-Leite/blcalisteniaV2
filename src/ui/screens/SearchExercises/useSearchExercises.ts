import { useCallback, useMemo, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useForm } from "react-hook-form"
import { MuscleGroup } from "@/constants"
import { ExerciseModel, useGetExercises, useDeleteExercise } from "@/domains/Exercise"

import { useDebounceValue } from "@/hooks"
import { useAddWorkoutExercise } from "@/domains/WorkoutExercise"
import { useAddWorkoutExerciseContext } from "@/providers/addWorkoutExercise"

export const useSearchExercises = () => {
	const router = useRouter()

	const params = useLocalSearchParams<{ workoutId: string }>()
	const workoutId = params?.workoutId

	const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<null | MuscleGroup>(
		null,
	)
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
	const { defaultExercises, userExercises, isLoading } = useGetExercises()

	const { execute: deleteExercise, isLoading: isDeletingExercise } = useDeleteExercise()

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

	const filterList = useCallback(
		(exercises: ExerciseModel[]) => {
			return exercises.filter((exercise) => {
				const matchesMuscleGroup = selectedMuscleGroup
					? exercise.musclesGroups.includes(selectedMuscleGroup)
					: true

				const searchText = debouncedSearchText.toLowerCase()
				const matchesSearchText = searchText?.trim()?.length
					? exercise.name.toLowerCase().includes(searchText)
					: true

				return matchesMuscleGroup && matchesSearchText
			})
		},
		[selectedMuscleGroup, debouncedSearchText],
	)

	const filteredExercises = useMemo(() => {
		return filterList(defaultExercises)
	}, [defaultExercises, filterList])

	const filteredCustomExercises = useMemo(() => {
		return filterList(userExercises)
	}, [userExercises, filterList])

	const isCustomExercisesEmpty = filteredCustomExercises.length === 0

	return {
		form,
		states: {
			searchText,
			selectedMuscleGroup,
			exercises: filteredExercises,
			customExercises: filteredCustomExercises,
			isCustomExercisesEmpty,
			selectedExercise,
			isLoading,
			isCreateModalVisible,
			editingExercise,
			selectedExerciseToDelete,
			isDeletingExercise,
		},
		actions: {
			handleGoBack,
			handleMuscleGroupSelect,
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
		},
	}
}
