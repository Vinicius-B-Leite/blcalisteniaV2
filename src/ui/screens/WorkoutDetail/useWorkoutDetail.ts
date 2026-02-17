export const useWorkoutDetail = () => {
	const handleEditPress = () => {
		console.log("Edit workout")
	}

	const handleExercisePress = (id: string) => {
		console.log("Exercise pressed:", id)
	}

	const handleExerciseEditPress = (id: string) => {
		console.log("Exercise edit pressed:", id)
	}

	const handleExerciseDeletePress = (id: string) => {
		console.log("Exercise delete pressed:", id)
	}

	const handleStartWorkout = () => {
		console.log("Start workout")
	}

	const handleAddExercise = () => {
		console.log("Add exercise")
	}

	return {
		actions: {
			handleEditPress,
			handleExercisePress,
			handleExerciseEditPress,
			handleExerciseDeletePress,
			handleStartWorkout,
			handleAddExercise,
		},
	}
}
