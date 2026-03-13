import { View, ActivityIndicator } from "react-native"
import { Icon, Pressable, Text } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { ImageSelector as Types } from "./types"

export const AddImageItem = ({ onPress, isLoading }: Types.AddImageItemProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<Pressable.Root
			style={styles.addImageItem}
			onPress={onPress}
			disabled={isLoading}>
			<View style={styles.addImageContent}>
				{isLoading ? (
					<ActivityIndicator size="small" color={theme.content["icon-brand"]} />
				) : (
					<>
						<Icon name="attach" size={14} variant="secondary" />
						<Text variant="caption-reg" style={styles.addImageText}>
							Adicionar imagem
						</Text>
					</>
				)}
			</View>
		</Pressable.Root>
	)
}
