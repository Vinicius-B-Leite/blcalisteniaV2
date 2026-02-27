import { View } from "react-native"
import { Modal, Button, Text } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { DeleteWorkoutModalProps } from "./types"

export const DeleteWorkoutModal = ({
	visible,
	workoutName,
	onClose,
	onConfirm,
}: DeleteWorkoutModalProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>Deseja realmente remover o treino {workoutName}?</Modal.Title>

			<View style={styles.buttonsContainer}>
				<Button.Root variant="danger" onPress={onConfirm}>
					<Button.Content>Remover</Button.Content>
				</Button.Root>

				<Button.Root variant="ghost" onPress={onClose}>
					<Button.Content>Cancelar</Button.Content>
				</Button.Root>
			</View>
		</Modal.Root>
	)
}
