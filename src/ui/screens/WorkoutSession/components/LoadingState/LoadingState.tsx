import { View } from "react-native"
import { Screen, Header, Skeleton } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { WORKOUT_SESSION_SCREEN_TEST_IDS } from "../../constants"

export const LoadingState = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<Screen testID={WORKOUT_SESSION_SCREEN_TEST_IDS.LOADING_STATE}>
			<Header.Root>
				<Header.GoBack />
				<Header.HorizontalCenterTitle>
					Sessão de treino
				</Header.HorizontalCenterTitle>
			</Header.Root>
			<View style={styles.container}>
				<View style={styles.timerRow}>
					<Skeleton width={160} height={16} style={styles.roundedSkeleton} />
					<Skeleton width={48} height={16} style={styles.roundedSkeleton} />
				</View>

				<View style={styles.summaryCard}>
					<Skeleton width="100%" height={48} style={styles.roundedSkeleton} />
					<View style={styles.muscleRow}>
						<Skeleton width={120} height={16} style={styles.roundedSkeleton} />
						<Skeleton width={80} height={16} style={styles.roundedSkeleton} />
					</View>
				</View>

				<View style={styles.indicatorsContainer}>
					<Skeleton width={16} height={6} style={styles.indicatorSkeleton} />
					<Skeleton width={6} height={6} style={styles.indicatorSkeleton} />
					<Skeleton width={6} height={6} style={styles.indicatorSkeleton} />
				</View>

				<Skeleton width="100%" height={16} style={styles.roundedSkeleton} />

				<View style={styles.setsContainer}>
					<Skeleton width={48} height={48} style={styles.setSkeleton} />
					<Skeleton width={48} height={48} style={styles.setSkeleton} />
					<Skeleton width={48} height={48} style={styles.setSkeleton} />
				</View>
			</View>
		</Screen>
	)
}
