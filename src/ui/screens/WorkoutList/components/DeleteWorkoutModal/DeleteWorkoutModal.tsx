import { View } from "react-native"
import { Modal, Button } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { DeleteWorkoutModalProps } from "./types"
import { WORKOUT_LIST_SCREEN_TEST_IDS } from "../../constants"

export const DeleteWorkoutModal = ({
	visible,
	workoutName,
	onClose,
	onConfirm,
	isLoading = false,
}: DeleteWorkoutModalProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>Deseja realmente remover o treino {workoutName}?</Modal.Title>

			<View style={styles.buttonsContainer}>
				<Button.Root
					variant="danger"
					onPress={onConfirm}
					isLoading={isLoading}
					testID={WORKOUT_LIST_SCREEN_TEST_IDS.DELETE_BUTTON({
						id: "confirm",
					})}>
					<Button.Content>Remover</Button.Content>
				</Button.Root>

				<Button.Root variant="ghost" onPress={onClose}>
					<Button.Content>Cancelar</Button.Content>
				</Button.Root>
			</View>
		</Modal.Root>
	)
}
