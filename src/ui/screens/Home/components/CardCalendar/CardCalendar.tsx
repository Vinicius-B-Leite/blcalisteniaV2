import { ScrollView, View } from "react-native"
import { useAppTheme } from "../../../../theme/hooks/useAppTheme"
import { styleTheme } from "./styles"
import { Text } from "../../../../components/core/Text"
import { stringUtils } from "../../../../../utils/string"
import { Icon } from "../../../../components/core/Icon"
import { Pressable } from "../../../../components/core/Pressable"
import { useCardCalendar } from "./useCardCalendar"

export const CardCalendar = () => {
	const { states, actions } = useCardCalendar()
	const { theme } = useAppTheme()
	const styles = styleTheme(theme)

	return (
		<View style={styles.container}>
			<View>
				<Text variant="title-small-bold">Essa semana</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.weekDaysContainer}>
					{states.currentWeekDaysNumber.map((day, index) => (
						<View
							key={day}
							style={[
								styles.weekDayItemContainer,
								actions.isCurrentDay(day) &&
									styles.weekDayItemContainerActive,
							]}>
							<Text variant="title-small-bold">
								{stringUtils.capitalizeFirstLetter(
									states.weekDaysNames[index],
								)}
							</Text>
							<View style={[styles.weekDayItemNumber]}>
								<Text variant="title-small-bold">{day}</Text>
							</View>
						</View>
					))}
				</ScrollView>
			</View>
			<View style={styles.optionsContainer}>
				<View style={styles.optionItemContainer}>
					<View style={styles.optionItemIconContainer}>
						<Icon name="clock" size={30} />
					</View>

					<Text variant="title-small-bold">0 min</Text>
				</View>

				<Pressable.Root
					onPress={actions.handleWorkoutStatus().onPress}
					style={styles.optionItemContainer}>
					<View style={styles.optionItemIconContainer}>
						<Icon name={actions.handleWorkoutStatus().iconName} size={30} />
					</View>

					<Text variant="title-small-bold">
						{actions.handleWorkoutStatus().title}
					</Text>
				</Pressable.Root>
			</View>
		</View>
	)
}
