import { Modal, Button, Text, Input } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { View } from "react-native"
import { WeekDaySelector } from "./WeekDaySelector"
import { WorkoutTypeSelector } from "./WorkoutTypeSelector"
import { ReactNode } from "react"
import { Category } from "src/constants"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormSchema, schema } from "./schema"
import { WeekDaysFrequency } from "src/domain/Workout/WorkoutModel"

export interface WorkoutFormValues {
	name: string
	description: string
	weekDays: WeekDaysFrequency[]
	type: Category
}

interface WorkoutFormModalProps {
	visible: boolean
	onClose: () => void
	title: string
	confirmButtonText: string
	initialValues?: Partial<WorkoutFormValues>
	onConfirm?: (values: WorkoutFormValues) => void
	renderHeaderExtra?: ReactNode
}

export const WorkoutFormModal = ({
	visible,
	onClose,
	title,
	confirmButtonText,
	initialValues,
	onConfirm,
	renderHeaderExtra,
}: WorkoutFormModalProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	const form = useForm<FormSchema>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			name: initialValues?.name ?? "",
			description: initialValues?.description ?? "",
			weekDays: initialValues?.weekDays ?? [],
			type: initialValues?.type,
		},
	})

	const handleConfirm = form.handleSubmit((formValues) => {
		const values: WorkoutFormValues = {
			name: formValues.name,
			description: formValues.description,
			weekDays: formValues.weekDays,
			type: formValues.type,
		}

		onConfirm?.(values)
		form.reset()
		onClose()
	})

	const isFormValid = form.formState.isValid

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>{title}</Modal.Title>

			<Modal.Content style={styles.content}>
				{renderHeaderExtra}

				<View style={styles.top}>
					<Input.Root control={form.control} name="name">
						<Input.Label>Nome do treino</Input.Label>
						<Input.FieldWrapper>
							<Input.Field placeholder="Treino X" />
						</Input.FieldWrapper>
						<Input.Error />
					</Input.Root>

					<Input.Root control={form.control} name="description">
						<Input.Label>Descrição do treino</Input.Label>
						<Input.FieldWrapper>
							<Input.Field placeholder="Treino de costas" />
						</Input.FieldWrapper>
						<Input.Error />
					</Input.Root>
				</View>

				<View style={styles.bottom}>
					<Input.Root control={form.control} name="type">
						<Controller
							control={form.control}
							name="type"
							render={({ field: { onChange, value } }) => (
								<WorkoutTypeSelector
									selectedType={value}
									onTypeChange={onChange}
								/>
							)}
						/>
						<Input.Error>
							{form.getFieldState("type").error?.message}
						</Input.Error>
					</Input.Root>

					<Input.Root control={form.control} name="weekDays">
						<Controller
							control={form.control}
							name="weekDays"
							render={({ field: { onChange, value } }) => (
								<WeekDaySelector
									selectedDays={value}
									onDaysChange={onChange}
								/>
							)}
						/>
						<Input.Error>
							{form.getFieldState("weekDays").error?.message}
						</Input.Error>
					</Input.Root>

					<View style={styles.buttonsWrapper}>
						<Button.Root disabled={!isFormValid} onPress={handleConfirm}>
							<Button.Content>{confirmButtonText}</Button.Content>
						</Button.Root>

						<Button.Root variant="ghost" onPress={onClose}>
							<Button.Content>Cancelar</Button.Content>
						</Button.Root>
					</View>
				</View>
			</Modal.Content>
		</Modal.Root>
	)
}
