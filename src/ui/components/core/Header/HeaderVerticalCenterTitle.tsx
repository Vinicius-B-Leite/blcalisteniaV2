import { Text } from "../Text"
import { Header } from "./HeaderTypes"
import { styles } from "./styles"

export const HeaderHorizontalCenterTitle = ({
	children,
	variant = "title-large-bold",
	style,
	...props
}: Header.TitleProps) => {
	return (
		<Text
			variant="title-large-bold"
			style={[styles.horizontalCenterTitle, style]}
			{...props}>
			{children}
		</Text>
	)
}
