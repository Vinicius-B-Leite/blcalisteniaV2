import {
	useAddWorkoutExercise,
	useGetExercisesWithSetsByWorkout,
	useUpdateWorkoutExerciseSets,
} from "@/domains/WorkoutExercise"
import { useRouter } from "expo-router"
import { useAddWorkoutExerciseContext } from "@/providers/addWorkoutExercise"
import { FormSchema, schema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"

export const useAddExerciseModal = ({
	workoutId,
	onClose,
	workoutExerciseId,
}: {
	workoutId: string
	onClose: VoidFunction
	workoutExerciseId?: string
}) => {
	const router = useRouter()
	const isEditMode = !!workoutExerciseId

	const { currentWorkoutExercises, resetCurrentWorkoutExercise } =
		useAddWorkoutExerciseContext()
	const { execute: addExercise } = useAddWorkoutExercise()
	const { execute: updateSets, isLoading: isUpdateLoading } =
		useUpdateWorkoutExerciseSets()

	const { exercisesWithSets } = useGetExercisesWithSetsByWorkout(workoutId)
	const editExercise = isEditMode
		? exercisesWithSets.find(
				(e) =>
					e.workoutExerciseId === workoutExerciseId ||
					e.id === workoutExerciseId,
			)
		: undefined

	const seriesRepsRest = {
		series: "",
		reps: "",
		rest: "",
	}
	const form = useForm<FormSchema>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			exerciseName: "",
			...seriesRepsRest,
		},
	})

	const handleAdd = form.handleSubmit(async (formValues) => {
		if (!currentWorkoutExercises?.id) return

		const seriesCount = Number(formValues.series) ?? 1
		const sets = Array.from({ length: seriesCount }, () => ({
			reps: Number(formValues.reps),
			rest: Number(formValues.rest),
		}))
		await addExercise({
			exerciseId: currentWorkoutExercises?.id,
			workoutId: workoutId,
			sets: sets,
		})
		form.reset()
		onClose()
	})

	const handleSave = form.handleSubmit(async (formValues) => {
		if (!workoutExerciseId) return

		const seriesCount = Number(formValues.series) ?? 1
		const sets = Array.from({ length: seriesCount }, () => ({
			reps: Number(formValues.reps),
			rest: Number(formValues.rest),
		}))
		await updateSets({ workoutExerciseId, sets })
		form.reset()
		onClose()
	})

	const handleSearchExercises = (onClose: () => void) => {
		onClose()
		router.push({
			pathname: "/(application)/workout/[workoutId]/searchExercises",
			params: { workoutId: workoutId },
		})
	}

	const handleClose = () => {
		form.reset()
		resetCurrentWorkoutExercise()
		onClose()
	}

	const applyInitialValuesOnCreateMode = useCallback(() => {
		if (isEditMode) return
		if (currentWorkoutExercises) {
			form.reset({
				exerciseName: currentWorkoutExercises.name,
				...seriesRepsRest,
			})
			return
		}

		form.reset({
			exerciseName: "",
			...seriesRepsRest,
		})
	}, [currentWorkoutExercises])

	const applyInitialValuesOnEditMode = useCallback(() => {
		if (!isEditMode || !editExercise) return
		const sets = editExercise.sets
		form.reset({
			exerciseName: editExercise.name,
			series: sets.length > 0 ? String(sets.length) : "",
			reps: sets.length > 0 ? String(sets[0].reps) : "",
			rest: sets.length > 0 ? String(sets[0].rest) : "",
		})
	}, [editExercise?.workoutExerciseId ?? editExercise?.id])

	useEffect(() => {
		applyInitialValuesOnCreateMode()
	}, [applyInitialValuesOnCreateMode])
	useEffect(() => {
		applyInitialValuesOnEditMode()
	}, [applyInitialValuesOnEditMode])

	const isFormValid = form.formState.isValid

	return {
		form,

		states: {
			isFormValid,
			isUpdateLoading,
			isEditMode,
		},
		actions: {
			handleSearchExercises,
			handleAdd,
			handleSave,
			handleClose,
		},
	}
}
