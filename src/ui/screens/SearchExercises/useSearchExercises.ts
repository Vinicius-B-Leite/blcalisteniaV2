import { useState } from "react"
import { useRouter } from "expo-router"

const CATEGORIES = ["Bíceps", "Pernas", "Peitoral", "Costas", "Core", "Ombros"]

const MOCK_EXERCISES = [
	{
		id: "1",
		title: "Knee Push Ups",
		category: "Peitoral",
		imageUrl:
			"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=100&fit=crop",
	},
	{
		id: "2",
		title: "Flexão Padrão",
		category: "Peitoral",
		imageUrl:
			"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=100&fit=crop",
	},
	{
		id: "3",
		title: "Ring Push Ups",
		category: "Peitoral",
		imageUrl:
			"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=100&fit=crop",
	},
]

const CUSTOM_EXERCISES = [
	{
		id: "4",
		title: "Flexão",
		category: "Peitoral",
	},
]

export const useSearchExercises = () => {
	const router = useRouter()
	const [searchText, setSearchText] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("Bíceps")
	const [selectedExercises, setSelectedExercises] = useState<string[]>([])

	const handleSearchChange = (text: string) => {
		setSearchText(text)
	}

	const handleGoBack = () => {
		router.back()
	}

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category)
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

	const isCustomExercisesEmpty = CUSTOM_EXERCISES.length === 0

	return {
		states: {
			searchText,
			categories: CATEGORIES,
			selectedCategory,
			exercises: MOCK_EXERCISES,
			customExercises: CUSTOM_EXERCISES,
			isCustomExercisesEmpty,
			selectedExercises,
		},
		actions: {
			handleSearchChange,
			handleGoBack,
			handleCategorySelect,
			handleExercisePress,
			handleFavoritePress,
			handleToggleExercise,
			handleAddExercises,
		},
	}
}
