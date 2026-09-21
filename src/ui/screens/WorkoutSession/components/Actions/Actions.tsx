import { View } from "react-native"
import { Button, Text } from "@/components/core"
import { useAppTheme } from "@/themes/hooks/useAppTheme"
import { stylesTheme } from "./styles"
import { ActionButton } from "./ActionButton"
import { useRestTimer } from "../../useRestTimer"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../../constants"
import { ActionsProps } from "./types"

const formatRestTime = (totalSeconds: number) => {
	const safeSeconds = Math.max(totalSeconds, 0)
	const minutes = Math.floor(safeSeconds / 60)
	const seconds = safeSeconds % 60

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export const Actions = ({
	completeSet,
	advanceAfterRest,
	plannedRestSeconds,
}: ActionsProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)
	const { restSecondsLeft, isResting, start, addSeconds, skip } = useRestTimer(
		advanceAfterRest,
	)

	const displayedRestSeconds = isResting ? restSecondsLeft : plannedRestSeconds

	const handleCompleteSet = () => {
		const restSeconds = completeSet()
		start(restSeconds)
	}

	return (
		<View>
			<View style={styles.actions}>
				<ActionButton
					label="+ 10 segundos"
					isActive={isResting}
					disabled={!isResting}
					iconName="plus"
					onPress={() => addSeconds(10)}
					testID={WORKOUT_SESSION_SCREEN_TEST_IDS.ADD_REST_SECONDS_BUTTON}
				/>
				<ActionButton
					label="Pular descanso"
					isActive={isResting}
					disabled={!isResting}
					iconName="return"
					onPress={skip}
					testID={WORKOUT_SESSION_SCREEN_TEST_IDS.SKIP_REST_BUTTON}
				/>
				<ActionButton
					label="Concluir série"
					isActive={!isResting}
					disabled={isResting}
					iconName="play"
					onPress={handleCompleteSet}
					testID={WORKOUT_SESSION_SCREEN_TEST_IDS.COMPLETE_SET_BUTTON}
				/>
			</View>

			<Button.Root variant="primary">
				<Button.Content>
					<Text
						variant="title-small-bold"
						testID={WORKOUT_SESSION_SCREEN_TEST_IDS.REST_TIMER_VALUE}>
						{formatRestTime(displayedRestSeconds)}
					</Text>
				</Button.Content>
			</Button.Root>

			<Button.Root variant="ghost">
				<Button.Content>Editar exercício</Button.Content>
			</Button.Root>
		</View>
	)
}
