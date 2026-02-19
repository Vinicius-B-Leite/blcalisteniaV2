import { View } from "react-native"
import { Text } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"

export const EmptyState = () => {
	const styles = useStyles(stylesTheme)

	return (
		<View style={styles.container}>
			<Text variant="body-large-bold" style={styles.title}>
				Você ainda não tem exercícios por aqui!
			</Text>
			<Text variant="body-small-reg" style={styles.description}>
				Comece agora criando o seu primeiro exercício personalizado!
			</Text>
		</View>
	)
}
