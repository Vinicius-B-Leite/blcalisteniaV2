import { View } from "react-native"
import { useModalContext } from "./ModalContext"
import { Icon } from "../Icon/Icon"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { createStyles } from "./styles"

export const ModalHeader = () => {
	const { onClose } = useModalContext()
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	return (
		<View style={styles.header}>
			<Icon name="x" size={20} variant="default" onPress={onClose} />
		</View>
	)
}
