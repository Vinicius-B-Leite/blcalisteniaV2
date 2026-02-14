import { View } from "react-native"
import { Screen } from "../../components/core/Screen/Screen"
import { useStyles } from "../../theme/hooks/useStyles"
import { Header, CardCalendar, RecommendedWorkout, Blog } from "./components"
import { stylesTheme } from "./styles"
import { useHome } from "./useHome"

export function HomeScreen() {
	const { actions, states, refs } = useHome()
	const styles = useStyles((theme) => stylesTheme(theme, states.insets))

	return (
		<Screen nestedScrollEnabled scrollable>
			<View style={styles.container}>
				<Header
					userName={states.userName}
					onNotificationsPress={actions.handleNotificationsPress}
				/>

				<CardCalendar />

				<RecommendedWorkout />

				<Blog onSeeMorePress={actions.handleSeeMoreBlog} />
			</View>
		</Screen>
	)
}
