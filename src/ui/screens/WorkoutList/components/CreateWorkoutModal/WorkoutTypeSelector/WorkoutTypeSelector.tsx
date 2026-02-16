import { FlatList, ScrollView, View } from "react-native"
import { Text } from "@/components/core"
import { Pressable } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"

export type WorkoutType = "strength" | "mobility" | "resistance" | "flexibility"

interface WorkoutTypeOption {
	label: string
	value: WorkoutType
}

const workoutTypes: WorkoutTypeOption[] = [
	{ label: "Força", value: "strength" },
	{ label: "Mobilidade", value: "mobility" },
	{ label: "Resistência", value: "resistance" },
	{ label: "Flexibilidade", value: "flexibility" },
]

interface WorkoutTypeSelectorProps {
	selectedType?: WorkoutType
	onTypeChange?: (type: WorkoutType) => void
}

export const WorkoutTypeSelector = ({
	selectedType,
	onTypeChange,
}: WorkoutTypeSelectorProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	const handleTypeSelect = (type: WorkoutType) => {
		onTypeChange?.(type)
	}

	const isTypeSelected = (type: WorkoutType) => selectedType === type

	return (
		<View style={styles.container}>
			<Text variant="body-small-bold" style={styles.label}>
				Tipo de treino
			</Text>

			<FlatList
				horizontal
				style={styles.typesWrapper}
				data={workoutTypes}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item: type }) => (
					<Pressable.Root
						key={type.value}
						onPress={() => handleTypeSelect(type.value)}
						style={[
							styles.typeButton,
							isTypeSelected(type.value) && styles.typeButtonSelected,
						]}>
						<Text
							variant="body-small-reg"
							style={[
								styles.typeText,
								isTypeSelected(type.value) && styles.typeTextSelected,
							]}>
							{type.label}
						</Text>
					</Pressable.Root>
				)}
			/>
		</View>
	)
}
