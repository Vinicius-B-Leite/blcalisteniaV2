import { View } from "react-native"
import { Screen, Header, Text } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { EmptyStateProps } from "./types"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../../constants"

export const EmptyState = ({ workoutTitle }: EmptyStateProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.HorizontalCenterTitle>
					{workoutTitle}
				</Header.HorizontalCenterTitle>
			</Header.Root>

			<View
				style={styles.container}
				testID={WORKOUT_SESSION_SCREEN_TEST_IDS.EMPTY_STATE}>
				<Text variant="body-large-bold" style={styles.title}>
					Este treino ainda não tem exercícios
				</Text>
				<Text variant="body-small-reg" style={styles.description}>
					Adicione exercícios ao treino para começar a sessão.
				</Text>
			</View>
		</Screen>
	)
}
