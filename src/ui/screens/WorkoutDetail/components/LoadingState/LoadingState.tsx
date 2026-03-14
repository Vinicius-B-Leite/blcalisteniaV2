import { View } from "react-native"
import { Screen, Header, Skeleton } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"

export const LoadingState = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<Screen>
			<Header.Root>
				<Header.GoBack />
				<Header.VerticalCenterTitle>
					Detalhes do Treino
				</Header.VerticalCenterTitle>
			</Header.Root>
			<View style={styles.container}>
				<Skeleton width="100%" height={200} style={styles.bannerSkeleton} />
				<View style={styles.exercisesContainer}>
					<Skeleton width="100%" height={80} style={styles.exerciseSkeleton} />
					<Skeleton width="100%" height={80} style={styles.exerciseSkeleton} />
					<Skeleton width="100%" height={80} style={styles.exerciseSkeleton} />
				</View>
			</View>
		</Screen>
	)
}
