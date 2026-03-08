import { View, FlatList } from "react-native"
import { Text } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { ImageSelector as Types } from "./types"
import { ImageItem } from "./ImageItem"
import { AddImageItem } from "./AddImageItem"
import { WORKOUT_BANNER_PATHS, WORKOUT_BANNER_MAP } from "@/utils/workoutBanner"

const IMAGE_OPTIONS: Types.ImageOption[] = WORKOUT_BANNER_PATHS.map((path) => ({
	id: path,
	source: WORKOUT_BANNER_MAP[path],
}))

export const ImageSelector = ({
	selectedImage,
	onImageSelect,
	onAddImage,
	isAddingImage,
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
				ListHeaderComponent={
					<AddImageItem onPress={onAddImage} isLoading={isAddingImage} />
				}
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
