import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { CategoryFilter } from "./types"
import { Pressable, Text } from "@/components/core"

export function CategoryChip({ label, isSelected, onPress }: CategoryFilter.ChipProps) {
	const styles = useStyles(stylesTheme)

	return (
		<Pressable.Root
			onPress={onPress}
			style={[styles.chip, isSelected && styles.chipSelected]}>
			<Text
				variant="body-small-reg"
				style={[styles.chipText, isSelected && styles.chipTextSelected]}>
				{label}
			</Text>
		</Pressable.Root>
	)
}
