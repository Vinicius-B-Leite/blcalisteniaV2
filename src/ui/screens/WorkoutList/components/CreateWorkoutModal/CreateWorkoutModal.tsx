import { Modal, Button, Text, Input } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { View } from "react-native"
import { WeekDaySelector, WeekDay } from "./WeekDaySelector"
import { WorkoutTypeSelector, WorkoutType } from "./WorkoutTypeSelector"
import { useState } from "react"

interface CreateWorkoutModalProps {
	visible: boolean
	onClose: () => void
}

export const CreateWorkoutModal = ({ visible, onClose }: CreateWorkoutModalProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)
	const [selectedDays, setSelectedDays] = useState<WeekDay[]>([])
	const [selectedType, setSelectedType] = useState<WorkoutType>()

	const handleCreate = () => {
		// TODO: Implementar lógica de criação do treino com selectedDays e selectedType
		onClose()
	}

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>Criar treino</Modal.Title>

			<Modal.Content style={styles.content}>
				<View style={styles.top}>
					<Input.Root>
						<Input.Label>Nome do treino</Input.Label>
						<Input.FieldWrapper>
							<Input.Field placeholder="Treino X" />
						</Input.FieldWrapper>
					</Input.Root>

					<Input.Root>
						<Input.Label>Descrição do treino</Input.Label>
						<Input.FieldWrapper>
							<Input.Field placeholder="Treino de costas" />
						</Input.FieldWrapper>
					</Input.Root>
				</View>

				<View style={styles.bottom}>
					<WeekDaySelector
						selectedDays={selectedDays}
						onDaysChange={setSelectedDays}
					/>

					<WorkoutTypeSelector
						selectedType={selectedType}
						onTypeChange={setSelectedType}
					/>

					<View style={styles.buttonsWrapper}>
						<Button.Root disabled onPress={handleCreate}>
							<Button.Content>Criar</Button.Content>
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
