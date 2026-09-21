import { View } from "react-native"
import { Modal, Button, Text } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { ExitConfirmationModalProps } from "./types"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../../constants"

export const ExitConfirmationModal = ({
	visible,
	onClose,
	onConfirm,
}: ExitConfirmationModalProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>Sair do treino?</Modal.Title>

			<View
				style={styles.content}
				testID={WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_MODAL}>
				<Text style={styles.message} variant="body-small-reg">
					Seu progresso nessa sessão será perdido.
				</Text>

				<View style={styles.buttonsContainer}>
					<Button.Root
						variant="danger"
						onPress={onConfirm}
						testID={
							WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_CONFIRM_BUTTON
						}>
						<Button.Content>Sair</Button.Content>
					</Button.Root>

					<Button.Root
						variant="ghost"
						onPress={onClose}
						testID={
							WORKOUT_SESSION_SCREEN_TEST_IDS.EXIT_CONFIRMATION_CANCEL_BUTTON
						}>
						<Button.Content>Cancelar</Button.Content>
					</Button.Root>
				</View>
			</View>
		</Modal.Root>
	)
}
