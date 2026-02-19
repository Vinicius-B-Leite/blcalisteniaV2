import { Pressable, Image } from "react-native"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { ImageSelector as Types } from "./types"

export const ImageItem = ({ id, source, isSelected, onPress }: Types.ImageItemProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<Pressable
			style={[styles.imageItem, isSelected && styles.imageItemSelected]}
			onPress={() => onPress(id)}>
			<Image source={source} style={styles.image} resizeMode="cover" />
		</Pressable>
	)
}
