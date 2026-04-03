import { useCallback, useMemo, useState } from "react"
import { useRouter } from "expo-router"
import { useForm } from "react-hook-form"
import { MuscleGroup } from "@/constants"
import { ExerciseModel, useGetExercises } from "@/domains/Exercise"

import { useDebounceValue } from "@/hooks"

export const useSearchExercises = () => {
	const router = useRouter()

	const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<null | MuscleGroup>(
		null,
	)
	const [selectedExercises, setSelectedExercises] = useState<string[]>([])
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
	const [editingExercise, setEditingExercise] = useState<ExerciseModel | null>(null)

	const form = useForm({
		defaultValues: {
			searchText: "",
		},
	})

	const searchText = form.watch("searchText")
	const debouncedSearchText = useDebounceValue(searchText)

	const { defaultExercises, userExercises, isLoading } = useGetExercises()

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

	const handleToggleExercise = (id: string) => {
		setSelectedExercises((prev) => {
			if (prev.includes(id)) {
				return prev.filter((exerciseId) => exerciseId !== id)
			}
			return [...prev, id]
		})
	}

	const handleAddExercises = () => {
		console.log("Adding exercises:", selectedExercises)
		// Implementar lógica de adicionar exercícios
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
			selectedExercises,
			isLoading,
			isCreateModalVisible,
			editingExercise,
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
		},
	}
}
