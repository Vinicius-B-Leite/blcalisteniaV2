import { FlatList, View } from "react-native"
import { Text } from "@/components/core"
import { Pressable } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { CATEGORIES, Category, CATEGORY_LABELS } from "src/constants"

interface WorkoutTypeOption {
	label: string
	value: Category
}

const workoutTypes: WorkoutTypeOption[] = [
	{ label: CATEGORY_LABELS.strength, value: CATEGORIES.strength },
	{ label: CATEGORY_LABELS.mobility, value: CATEGORIES.mobility },
	{ label: CATEGORY_LABELS.resistance, value: CATEGORIES.resistance },
	{ label: CATEGORY_LABELS.flexibility, value: CATEGORIES.flexibility },
]

interface WorkoutTypeSelectorProps {
	selectedType?: Category
	onTypeChange?: (type: Category) => void
}

export const WorkoutTypeSelector = ({
	selectedType,
	onTypeChange,
}: WorkoutTypeSelectorProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	const handleTypeSelect = (type: Category) => {
		onTypeChange?.(type)
	}

	const isTypeSelected = (type: Category) => selectedType === type

	return (
		<View style={styles.container}>
			<Text variant="body-small-bold" style={styles.label}>
				Tipo de treino
			</Text>

			<FlatList
				horizontal
				contentContainerStyle={styles.typesWrapper}
				data={workoutTypes}
				keyExtractor={(item) => item.value}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item: type }) => (
					<Pressable.Root
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
