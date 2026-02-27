import { Modal, Button, Text, Input } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { View } from "react-native"
import { WeekDaySelector, WeekDay } from "./WeekDaySelector"
import { WorkoutTypeSelector, WorkoutType } from "./WorkoutTypeSelector"
import { useState, ReactNode } from "react"

export interface WorkoutFormValues {
	name: string
	description: string
	weekDays: WeekDay[]
	type?: WorkoutType
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

	const [name, setName] = useState(initialValues?.name ?? "")
	const [description, setDescription] = useState(initialValues?.description ?? "")
	const [selectedDays, setSelectedDays] = useState<WeekDay[]>(
		initialValues?.weekDays ?? [],
	)
	const [selectedType, setSelectedType] = useState<WorkoutType | undefined>(
		initialValues?.type,
	)

	const handleConfirm = () => {
		const values: WorkoutFormValues = {
			name,
			description,
			weekDays: selectedDays,
			type: selectedType,
		}

		onConfirm?.(values)
		onClose()
	}

	const isFormValid =
		name.trim() !== "" &&
		description.trim() !== "" &&
		selectedDays.length > 0 &&
		selectedType

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>{title}</Modal.Title>

			<Modal.Content style={styles.content}>
				{renderHeaderExtra}

				<View style={styles.top}>
					<Input.Root>
						<Input.Label>Nome do treino</Input.Label>
						<Input.FieldWrapper>
							<Input.Field
								placeholder="Treino X"
								value={name}
								onChangeText={setName}
							/>
						</Input.FieldWrapper>
					</Input.Root>

					<Input.Root>
						<Input.Label>Descrição do treino</Input.Label>
						<Input.FieldWrapper>
							<Input.Field
								placeholder="Treino de costas"
								value={description}
								onChangeText={setDescription}
							/>
						</Input.FieldWrapper>
					</Input.Root>
				</View>

				<View style={styles.bottom}>
					<WorkoutTypeSelector
						selectedType={selectedType}
						onTypeChange={setSelectedType}
					/>

					<WeekDaySelector
						selectedDays={selectedDays}
						onDaysChange={setSelectedDays}
					/>

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
