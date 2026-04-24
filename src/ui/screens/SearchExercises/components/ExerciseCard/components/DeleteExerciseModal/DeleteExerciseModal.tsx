import { View } from "react-native"
import { Modal, Button } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { DeleteExerciseModalProps } from "./types"

export const DeleteExerciseModal = ({
	visible,
	exerciseName,
	onClose,
	onConfirm,
	isLoading = false,
}: DeleteExerciseModalProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>
				Deseja realmente remover o exercício {exerciseName}?
			</Modal.Title>

			<View style={styles.buttonsContainer}>
				<Button.Root
					variant="danger"
					onPress={onConfirm}
					isLoading={isLoading}
					testID="search-exercises-screen-delete-exercise-modal-confirm">
					<Button.Content>Remover</Button.Content>
				</Button.Root>

				<Button.Root
					variant="ghost"
					onPress={onClose}
					testID="search-exercises-screen-delete-exercise-modal-cancel">
					<Button.Content>Cancelar</Button.Content>
				</Button.Root>
			</View>
		</Modal.Root>
	)
}
