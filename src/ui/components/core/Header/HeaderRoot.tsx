import { View } from "react-native"
import { Header } from "./HeaderTypes"
import { styles } from "./styles"

export const HeaderRoot = ({ children, style, ...props }: Header.RootProps) => {
	return (
		<View style={[styles.root, style]} {...props}>
			{children}
		</View>
	)
}
