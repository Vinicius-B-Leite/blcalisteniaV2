import { FlatList, View } from "react-native"
import { Text, Pressable } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { MuscleGroup, MUSCLES_GROUP_LABELS } from "@/constants"

interface MuscleGroupOption {
	label: string
	value: MuscleGroup
}

const muscleGroups: MuscleGroupOption[] = [
	{ label: MUSCLES_GROUP_LABELS.biceps, value: "biceps" },
	{ label: MUSCLES_GROUP_LABELS.legs, value: "legs" },
	{ label: MUSCLES_GROUP_LABELS.chest, value: "chest" },
	{ label: MUSCLES_GROUP_LABELS.back, value: "back" },
	{ label: MUSCLES_GROUP_LABELS.core, value: "core" },
	{ label: MUSCLES_GROUP_LABELS.shoulders, value: "shoulders" },
]

type MuscleGroupSelectorProps = {
	selectedGroup: MuscleGroup | null
	onGroupChange?: (group: MuscleGroup | null) => void
}

export const MuscleGroupSelector = ({
	selectedGroup,
	onGroupChange,
}: MuscleGroupSelectorProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	const handleGroupSelect = (group: MuscleGroup) => {
		if (isGroupSelected(group)) {
			onGroupChange?.(null)
		} else {
			onGroupChange?.(group)
		}
	}

	const isGroupSelected = (group: MuscleGroup) => selectedGroup === group

	return (
		<View style={styles.container}>
			<Text variant="body-small-bold" style={styles.label}>
				Grupo muscular:
			</Text>

			<FlatList
				data={muscleGroups}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.value}
				contentContainerStyle={styles.groupsWrapper}
				renderItem={({ item: group }) => (
					<Pressable.Root
						onPress={() => handleGroupSelect(group.value)}
						style={[
							styles.groupButton,
							isGroupSelected(group.value) && styles.groupButtonSelected,
						]}>
						<Text
							variant="body-small-reg"
							style={[
								styles.groupText,
								isGroupSelected(group.value) && styles.groupTextSelected,
							]}>
							{group.label}
						</Text>
					</Pressable.Root>
				)}
			/>
		</View>
	)
}
