import { useAppTheme } from "@/themes/hooks"
import { Text } from "../Text/Text"
import { Modal } from "./ModalTypes"
import { createStyles } from "./styles"

export const ModalTitle = ({ children }: Modal.TitleProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	return (
		<Text variant="title-large-bold" style={styles.title}>
			{children}
		</Text>
	)
}
