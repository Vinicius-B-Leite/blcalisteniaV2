import { Pressable, View } from "react-native"
import { Icon, Text } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { ImageSelector as Types } from "./types"

export const AddImageItem = ({ onPress }: Types.AddImageItemProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<Pressable style={styles.addImageItem} onPress={onPress}>
			<View style={styles.addImageContent}>
				<Icon name="attach" size={14} variant="secondary" />
				<Text variant="caption-reg" style={styles.addImageText}>
					Adicionar imagem
				</Text>
			</View>
		</Pressable>
	)
}
