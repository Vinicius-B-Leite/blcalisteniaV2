import { FlatList } from "react-native"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { CategoryFilter as CategoryFilterTypes } from "./types"
import { CategoryChip } from "./CategoryChip"
import { MUSCLES_GROUPS_ARRAY } from "@/constants"

export function CategoryFilter({
	selectedCategory,
	onSelectCategory,
}: CategoryFilterTypes.Props) {
	const styles = useStyles(stylesTheme)

	return (
		<FlatList
			data={MUSCLES_GROUPS_ARRAY}
			renderItem={({ item }) => (
				<CategoryChip
					muscleGroup={item}
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
