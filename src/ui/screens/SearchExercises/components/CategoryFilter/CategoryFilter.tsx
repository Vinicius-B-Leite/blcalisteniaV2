import { FlatList } from "react-native"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { CategoryFilter as CategoryFilterTypes } from "./types"
import { CategoryChip } from "./CategoryChip"

export function CategoryFilter({
	categories,
	selectedCategory,
	onSelectCategory,
}: CategoryFilterTypes.Props) {
	const styles = useStyles(stylesTheme)

	return (
		<FlatList
			data={categories}
			renderItem={({ item }) => (
				<CategoryChip
					label={item}
					isSelected={item === selectedCategory}
					onPress={() => onSelectCategory(item)}
				/>
			)}
			keyExtractor={(item) => item}
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.container}
		/>
	)
}
