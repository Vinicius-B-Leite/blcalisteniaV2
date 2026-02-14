import { View } from "react-native"
import { Screen } from "../../components/core/Screen/Screen"
import { useStyles } from "../../theme/hooks/useStyles"
import { Header } from "./components/Header"
import { stylesTheme } from "./styles"
import { useHome } from "./useHome"
import { CardCalendar } from "./components/CardCalendar"
import { RecommendedWorkout } from "./components/RecommendedWorkout/RecommendedWorkout"

export function HomeScreen() {
	const { actions, states, refs } = useHome()
	const styles = useStyles((theme) => stylesTheme(theme, states.insets))

	return (
		<Screen>
			<View style={styles.container}>
				<Header
					userName={states.userName}
					onNotificationsPress={actions.handleNotificationsPress}
				/>

				<CardCalendar />

				<RecommendedWorkout />
			</View>
		</Screen>
	)
}
