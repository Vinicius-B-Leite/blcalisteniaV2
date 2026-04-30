import { View } from "react-native"
import { Modal, Button } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { DeleteExerciseModalProps } from "./types"
import { WORKOUT_DETAIL_SCREEN_TEST_IDS } from "../../constants"

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

			<Modal.Title>Deseja remover {exerciseName} do treino?</Modal.Title>

			<View style={styles.buttonsContainer}>
				<Button.Root
					variant="danger"
					onPress={onConfirm}
					isLoading={isLoading}
					testID={
						WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CONFIRM_BUTTON
					}>
					<Button.Content>Remover</Button.Content>
				</Button.Root>

				<Button.Root
					variant="ghost"
					onPress={onClose}
					testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_CANCEL_BUTTON}>
					<Button.Content>Cancelar</Button.Content>
				</Button.Root>
			</View>
		</Modal.Root>
	)
}
