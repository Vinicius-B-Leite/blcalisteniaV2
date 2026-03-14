import { useState } from "react"
import { useRouter } from "expo-router"
import { MuscleGroup } from "@/constants"

export const useAddExerciseModal = ({ workoutId }: { workoutId: string }) => {
	const router = useRouter()
	const [exerciseName, setExerciseName] = useState("")
	const [series, setSeries] = useState("0")
	const [reps, setReps] = useState("0")
	const [rest, setRest] = useState("0")
	const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null)

	const handleExerciseNameChange = (value: string) => {
		setExerciseName(value)
	}

	const handleSeriesChange = (value: string) => {
		setSeries(value)
	}

	const handleRepsChange = (value: string) => {
		setReps(value)
	}

	const handleRestChange = (value: string) => {
		setRest(value)
	}

	const handleGroupChange = (group: MuscleGroup | null) => {
		setSelectedGroup(group)
	}

	const handleSearchExercises = (onClose: () => void) => {
		onClose()
		router.push({
			pathname: "/(application)/workout/[workoutId]/searchExercises",
			params: { workoutId: workoutId },
		})
	}

	const handleAdd = (onClose: () => void) => {
		console.log({
			exerciseName,
			series,
			reps,
			rest,
			muscleGroup: selectedGroup,
		})
		onClose()
	}

	return {
		states: {
			exerciseName,
			series,
			reps,
			rest,
			selectedGroup,
		},
		actions: {
			handleExerciseNameChange,
			handleSeriesChange,
			handleRepsChange,
			handleRestChange,
			handleGroupChange,
			handleSearchExercises,
			handleAdd,
		},
	}
}
