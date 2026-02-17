import { useState } from "react"

type Workout = {
	id: string
	title: string
	exerciseCount: number
	category: string
	imageUrl?: string
}

const MOCK_WORKOUTS: Workout[] = [
	{
		id: "1",
		title: "Treino A",
		exerciseCount: 2,
		category: "Peitoral",
		imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
	},
	{
		id: "2",
		title: "Treino B",
		exerciseCount: 4,
		category: "Costas",
		imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
	},
	{
		id: "3",
		title: "Treino C",
		exerciseCount: 3,
		category: "Pernas",
		imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400",
	},
	{
		id: "4",
		title: "Treino D",
		exerciseCount: 5,
		category: "Ombros",
		imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
	},
]

export const useWorkoutList = () => {
	const [modalCreateWorkout, setModalCreateWorkout] = useState(false)
	const [searchText, setSearchText] = useState("")
	const [workouts, setWorkouts] = useState<Workout[]>(MOCK_WORKOUTS)

	const hasWorkouts = workouts.length > 0

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
		setWorkouts((prev) => prev.filter((workout) => workout.id !== id))
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
		},
		actions: {
			openModal: handleOpenModalCreateWorkout,
			closeModal: handleCloseModalCreateWorkout,
			onSearchTextChange: handleSearchTextChange,
			onEditWorkout: handleEditWorkout,
			onDeleteWorkout: handleDeleteWorkout,
		},
	}
}
