import {
	Button,
	Header,
	Icon,
	IconType,
	Pressable,
	Screen,
	Text,
} from "@/components/core"
import { useAppTheme } from "@/themes/hooks/useAppTheme"
import { View } from "react-native"
import { stylesTheme } from "./styles"
import { FocusedExercise } from "./components/FocusedExercise/FocusedExercise"

export const WorkoutSession = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	const Actions = () => {
		const ActionButton = ({
			label,
			isActive,
			iconName,
			onPress,
		}: {
			label: string
			isActive: boolean
			iconName: IconType.Names
			onPress?: () => void
		}) => {
			return (
				<Pressable.Root onPress={onPress} style={styles.actionsButton}>
					<View style={styles.actionButtonIcon}>
						<Icon
							name={iconName}
							size={18}
							variant={isActive ? "default" : "secondary"}
						/>
					</View>

					<Text
						style={[
							styles.actionButtonText,
							!isActive && styles.actionButtonTextInactive,
						]}
						variant="body-small-bold">
						{label}
					</Text>
				</Pressable.Root>
			)
		}

		return (
			<View>
				<View style={styles.actions}>
					<ActionButton label="+ 10 segundos" isActive iconName="plus" />
					<ActionButton
						label="Pular descanso"
						isActive={false}
						iconName="return"
					/>
					<ActionButton
						label="Concluir série"
						isActive={false}
						iconName="play"
					/>
				</View>

				<Button.Root variant="primary">
					<Button.Content>01:30</Button.Content>
				</Button.Root>

				<Button.Root variant="ghost">
					<Button.Content>Editar exercício</Button.Content>
				</Button.Root>
			</View>
		)
	}

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.HorizontalCenterTitle>Treino A</Header.HorizontalCenterTitle>
			</Header.Root>

			<View style={styles.sessionTimer}>
				<Text style={styles.sessionTimerLabel} variant="title-small-bold">
					Tempo total de treino:
				</Text>
				<Text style={styles.sessionTimerValue} variant="body-small-reg">
					00:48
				</Text>
			</View>

			<FocusedExercise />
			<Actions />
		</Screen>
	)
}
