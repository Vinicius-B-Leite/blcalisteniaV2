import { FlatList, View } from "react-native"
import { Text, Pressable } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"

export type MuscleGroup = "Bíceps" | "Pernas" | "Peitoral" | "Costas" | "Core" | "Ombros"

interface MuscleGroupOption {
	label: string
	value: MuscleGroup
}

const muscleGroups: MuscleGroupOption[] = [
	{ label: "Bíceps", value: "Bíceps" },
	{ label: "Pernas", value: "Pernas" },
	{ label: "Peitoral", value: "Peitoral" },
	{ label: "Costas", value: "Costas" },
	{ label: "Core", value: "Core" },
	{ label: "Ombros", value: "Ombros" },
]

interface MuscleGroupSelectorProps {
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
