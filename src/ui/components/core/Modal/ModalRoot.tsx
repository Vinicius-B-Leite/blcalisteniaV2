import { Modal as RNModal, View, TouchableWithoutFeedback } from "react-native"
import { Modal } from "./ModalTypes"
import { ModalProvider } from "./ModalContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { createStyles } from "./styles"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const ModalRoot = ({
	children,
	onClose,
	visible,
	animationType = "slide",
}: Modal.RootProps) => {
	const { theme } = useAppTheme()
	const insets = useSafeAreaInsets()
	const styles = createStyles(theme, insets.bottom)

	return (
		<RNModal
			visible={visible}
			transparent
			animationType={animationType}
			onRequestClose={onClose}
			statusBarTranslucent>
			<ModalProvider value={{ onClose }}>
				<TouchableWithoutFeedback onPress={onClose}>
					<View style={styles.overlay}>
						<TouchableWithoutFeedback>
							<View style={styles.container}>{children}</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</ModalProvider>
		</RNModal>
	)
}
