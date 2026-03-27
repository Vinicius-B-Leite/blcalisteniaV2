import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { CategoryFilter } from "./types"
import { Pressable, Text } from "@/components/core"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "../../constants"
import { MUSCLES_GROUP_LABELS } from "@/constants"

export function CategoryChip({
	muscleGroup,
	isSelected,
	onPress,
}: CategoryFilter.ChipProps) {
	const styles = useStyles(stylesTheme)

	return (
		<Pressable.Root
			onPress={onPress}
			testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.CATEGORY_CHIP({ muscleGroup })}
			style={[styles.chip, isSelected && styles.chipSelected]}>
			<Text
				variant="body-small-reg"
				style={[styles.chipText, isSelected && styles.chipTextSelected]}>
				{MUSCLES_GROUP_LABELS[muscleGroup]}
			</Text>
		</Pressable.Root>
	)
}
