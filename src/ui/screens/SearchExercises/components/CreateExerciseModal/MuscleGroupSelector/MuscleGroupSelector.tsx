import { View } from "react-native"
import { Pressable, Text } from "@/components/core"
import { MuscleGroup, MUSCLES_GROUPS_ARRAY, MUSCLES_GROUP_LABELS } from "@/constants"
import { CREATE_EXERCISE_MODAL_TEST_IDS } from "../constants"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"

type MuscleGroupSelectorProps = {
	selectedMuscleGroups: MuscleGroup[]
	onToggle: (muscleGroup: MuscleGroup) => void
}

export const MuscleGroupSelector = ({
	selectedMuscleGroups,
	onToggle,
}: MuscleGroupSelectorProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<View style={styles.container}>
			{MUSCLES_GROUPS_ARRAY.map((muscleGroup) => {
				const isSelected = selectedMuscleGroups.includes(muscleGroup)
				return (
					<Pressable.Root
						key={muscleGroup}
						testID={CREATE_EXERCISE_MODAL_TEST_IDS.MUSCLE_GROUP_CHIP({
							muscleGroup,
						})}
						accessibilityState={{ selected: isSelected }}
						onPress={() => onToggle(muscleGroup)}
						style={[styles.chip, isSelected && styles.chipSelected]}>
						<Text
							variant="body-small-reg"
							style={isSelected ? styles.chipTextSelected : undefined}>
							{MUSCLES_GROUP_LABELS[muscleGroup]}
						</Text>
					</Pressable.Root>
				)
			})}
		</View>
	)
}
