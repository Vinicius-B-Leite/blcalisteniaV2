import { useAppTheme } from "@/themes/hooks"
import { View } from "react-native"
import { createStyles } from "./styles"

import { Modal } from "./ModalTypes"

export const ModalContent = ({ children, style, ...props }: Modal.ContentProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	return (
		<View style={[styles.contentWrapper, style]} {...props}>
			{children}
		</View>
	)
}
