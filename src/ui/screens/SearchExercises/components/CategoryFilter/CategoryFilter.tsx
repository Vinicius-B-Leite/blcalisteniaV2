import { FlatList } from "react-native"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { CategoryFilter as CategoryFilterTypes } from "./types"
import { CategoryChip } from "./CategoryChip"
import { MUSCLES_GROUPS_ARRAY } from "@/constants"
import { Pressable, Text } from "@/components/core"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "../../constants"

export function CategoryFilter({
	selectedCategory,
	onSelectCategory,
	onlyCustom,
	onToggleOnlyCustom,
}: CategoryFilterTypes.Props) {
	const styles = useStyles(stylesTheme)

	return (
		<FlatList
			data={MUSCLES_GROUPS_ARRAY}
			ListHeaderComponent={
				<Pressable.Root
					onPress={onToggleOnlyCustom}
					testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.ONLY_CUSTOM_FILTER}
					style={[styles.chip, onlyCustom && styles.chipSelected]}>
					<Text
						variant="body-small-reg"
						style={[styles.chipText, onlyCustom && styles.chipTextSelected]}>
						Meus exercícios
					</Text>
				</Pressable.Root>
			}
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
