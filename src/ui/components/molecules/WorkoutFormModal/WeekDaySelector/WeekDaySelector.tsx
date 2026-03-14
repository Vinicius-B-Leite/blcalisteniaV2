import { FlatList, View } from "react-native"
import { Text } from "@/components/core"
import { Pressable } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { WeekDaysFrequency } from "src/domain/Workout/WorkoutModel"

interface WeekDayOption {
	label: string
	value: WeekDaysFrequency
}

const weekDays: WeekDayOption[] = [
	{ label: "D", value: 0 },
	{ label: "S", value: 1 },
	{ label: "T", value: 2 },
	{ label: "Q", value: 3 },
	{ label: "Q", value: 4 },
	{ label: "S", value: 5 },
	{ label: "S", value: 6 },
]

interface WeekDaySelectorProps {
	selectedDays?: WeekDaysFrequency[]
	onDaysChange?: (days: WeekDaysFrequency[]) => void
}

export const WeekDaySelector = ({
	selectedDays = [],
	onDaysChange,
}: WeekDaySelectorProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	const handleDayToggle = (day: WeekDaysFrequency) => {
		const newSelectedDays = selectedDays.includes(day)
			? selectedDays.filter((d) => d !== day)
			: [...selectedDays, day]

		onDaysChange?.(newSelectedDays)
	}

	const isDaySelected = (day: WeekDaysFrequency) => selectedDays.includes(day)

	return (
		<View style={styles.container}>
			<Text variant="body-small-bold" style={styles.label}>
				Dias da semana
			</Text>

			<FlatList
				data={weekDays}
				horizontal
				keyExtractor={(item) => item.value.toString()}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.daysWrapper}
				renderItem={({ item: day }) => (
					<Pressable.Root
						onPress={() => handleDayToggle(day.value)}
						style={[
							styles.dayButton,
							isDaySelected(day.value) && styles.dayButtonSelected,
						]}>
						<Text
							variant="body-large-regular"
							style={[
								styles.dayText,
								isDaySelected(day.value) && styles.dayTextSelected,
							]}>
							{day.label}
						</Text>
					</Pressable.Root>
				)}
			/>
		</View>
	)
}
