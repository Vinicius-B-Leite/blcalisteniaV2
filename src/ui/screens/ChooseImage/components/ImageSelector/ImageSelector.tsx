import { View, FlatList } from "react-native"
import { Text } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { ImageSelector as Types } from "./types"
import { ImageItem } from "./ImageItem"
import { AddImageItem } from "./AddImageItem"

const IMAGE_OPTIONS: Types.ImageOption[] = [
	{
		id: "banner-1",
		source: require("@/assets/imgs/workout-banner-1.png"),
	},
	{
		id: "banner-2",
		source: require("@/assets/imgs/workout-banner-2.png"),
	},
	{
		id: "banner-3",
		source: require("@/assets/imgs/workout-banner-3.jpg"),
	},
]

export const ImageSelector = ({
	selectedImage,
	onImageSelect,
	onAddImage,
}: Types.Props) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View style={styles.container}>
			<Text variant="body-small-bold" style={styles.title}>
				Opções
			</Text>

			<FlatList
				data={IMAGE_OPTIONS}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContainer}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={<AddImageItem onPress={onAddImage} />}
				renderItem={({ item }) => (
					<ImageItem
						id={item.id}
						source={item.source}
						isSelected={selectedImage === item.id}
						onPress={onImageSelect}
					/>
				)}
			/>
		</View>
	)
}
