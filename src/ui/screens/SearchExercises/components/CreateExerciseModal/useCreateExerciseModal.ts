import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExerciseModel, useCreateExercise, useUpdateExercise } from "@/domains/Exercise"
import { useAuth } from "@/domains/Auth"
import { FormSchema, schema } from "./schema"

type UseCreateExerciseModalParams = {
	visible: boolean
	onClose: () => void
	initialValues?: ExerciseModel
}

export const useCreateExerciseModal = ({
	visible,
	onClose,
	initialValues,
}: UseCreateExerciseModalParams) => {
	const { auth } = useAuth()
	const createExercise = useCreateExercise()
	const updateExercise = useUpdateExercise()

	const form = useForm<FormSchema>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: "",
			musclesGroups: [],
		},
	})

	useEffect(() => {
		if (visible) {
			form.reset({
				name: initialValues?.name ?? "",
				musclesGroups: initialValues?.musclesGroups ?? [],
			})
		}
	}, [visible, initialValues?.id])

	const exerciseId = initialValues?.id ?? null
	const isEditMode = !!exerciseId
	const isLoading = createExercise.isLoading || updateExercise.isLoading
	const isSubmitDisabled =
		!form.formState.isValid || isLoading || form.formState.isSubmitting

	const handleSubmit = form.handleSubmit(async (values) => {
		try {
			if (isEditMode) {
				await updateExercise.execute({
					id: exerciseId,
					name: values.name,
					musclesGroups: values.musclesGroups,
				})
			} else {
				await createExercise.execute({
					name: values.name,
					musclesGroups: values.musclesGroups,
					bannerUrl: null,
					userId: auth?.id ?? null,
				})
			}
			form.reset()
			onClose()
		} catch {
			// Error handled via useCreateExercise/useUpdateExercise onError callbacks
		}
	})

	const handleCancel = () => {
		onClose()
	}

	return {
		states: {
			isEditMode,
			isSubmitDisabled,
		},
		form,
		actions: {
			handleSubmit,
			handleCancel,
		},
	}
}
