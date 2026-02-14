import { Text } from "../Text/Text"
import { Header } from "./HeaderTypes"
import { styles } from "./styles"

export const HeaderVerticalCenterTitle = ({
	children,
	variant = "title-large-bold",
	style,
	...props
}: Header.TitleProps) => {
	return (
		<Text variant="title-large-bold" style={styles.verticalCenterTitle} {...props}>
			{children}
		</Text>
	)
}
