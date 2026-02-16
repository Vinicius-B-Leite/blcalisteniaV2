import { FlatList, View } from "react-native"
import { Text } from "@/components/core"
import { Pressable } from "@/components/core"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"

export type WeekDay = "S" | "T" | "Q" | "Qi" | "Se" | "Sa" | "D"

interface WeekDayOption {
	label: string
	value: WeekDay
}

const weekDays: WeekDayOption[] = [
	{ label: "D", value: "D" },
	{ label: "S", value: "S" },
	{ label: "T", value: "T" },
	{ label: "Q", value: "Q" },
	{ label: "Q", value: "Qi" },
	{ label: "S", value: "Se" },
	{ label: "S", value: "Sa" },
]

interface WeekDaySelectorProps {
	selectedDays?: WeekDay[]
	onDaysChange?: (days: WeekDay[]) => void
}

export const WeekDaySelector = ({
	selectedDays = [],
	onDaysChange,
}: WeekDaySelectorProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)

	const handleDayToggle = (day: WeekDay) => {
		const newSelectedDays = selectedDays.includes(day)
			? selectedDays.filter((d) => d !== day)
			: [...selectedDays, day]

		onDaysChange?.(newSelectedDays)
	}

	const isDaySelected = (day: WeekDay) => selectedDays.includes(day)

	return (
		<View style={styles.container}>
			<Text variant="body-small-bold" style={styles.label}>
				Dias da semana
			</Text>

			<FlatList
				style={styles.daysWrapper}
				data={weekDays}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item: day }) => (
					<Pressable.Root
						key={day.value}
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
