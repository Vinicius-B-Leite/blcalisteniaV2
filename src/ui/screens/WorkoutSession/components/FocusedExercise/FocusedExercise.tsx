import { useAppTheme } from "@/themes/hooks"
import { ScrollView, View } from "react-native"
import { stylesTheme } from "./styles"
import { Text } from "@/components/core"
import { PropsWithChildren } from "react"

export const FocusedExercise = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	const exerciseCount = 6
	const activeExerciseIndex = 0

	const Summary = () => {
		const isActive = (index: number) => index === activeExerciseIndex
		return (
			<>
				<View style={styles.summary}>
					<View style={styles.exerciseName}>
						<Text variant="title-large-bold" style={styles.exerciseNameText}>
							Flexão
						</Text>
					</View>

					<View style={styles.musclesGroup}>
						<Text variant="title-small-bold" style={styles.musclesGroupLabel}>
							Grupo muscular
						</Text>
						<Text
							variant="body-large-regular"
							style={styles.musclesGroupValue}
							numberOfLines={2}>
							Peitoral
						</Text>
					</View>
				</View>

				<View style={styles.exerciseCountIndicators}>
					{[...Array(exerciseCount)].map((_, i) => (
						<View
							key={i}
							style={[
								styles.exerciseCountIndicatorItem,
								isActive(i)
									? styles.exerciseCountIndicatorItemActive
									: styles.exerciseCountIndicatorItemInactive,
							]}
						/>
					))}
				</View>
			</>
		)
	}

	const SerieItem = ({
		serie,
		reps,
		hasNext = true,
	}: {
		serie: number
		reps: number
		hasNext?: boolean
	}) => {
		return (
			<View style={[styles.serieItem, hasNext && { flex: 1 }]}>
				<View style={styles.serieItem2}>
					<View style={styles.serieItemNumber}>
						<Text variant="body-small-bold">{serie}</Text>
					</View>
					{hasNext && (
						<View
							style={[
								styles.serieItemLine,
								exerciseCount > 3 && { width: 70 },
							]}
						/>
					)}
				</View>
				<Text variant="body-small-bold" style={styles.serieItemReps}>
					{reps} reps
				</Text>
			</View>
		)
	}

	const ExerciseContainer = ({ children }: PropsWithChildren) => {
		if (exerciseCount > 3) {
			return (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={{ paddingHorizontal: 24 }}>
					{children}
				</ScrollView>
			)
		}

		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					paddingHorizontal: 24,
				}}>
				{children}
			</View>
		)
	}

	return (
		<View style={styles.wrapper}>
			<Summary />

			<View style={styles.series}>
				<View style={styles.serieIndicator}>
					<View style={styles.serieIndicatorLine} />
					<Text variant="body-small-bold">1 de 4 séries</Text>
					<View style={styles.serieIndicatorLine} />
				</View>

				<ExerciseContainer>
					<SerieItem serie={1} reps={10} />
					<SerieItem serie={2} reps={10} />
					<SerieItem serie={3} reps={10} hasNext={true} />
					<SerieItem serie={4} reps={10} hasNext={true} />
					<SerieItem serie={4} reps={10} hasNext={true} />
					<SerieItem serie={4} reps={10} hasNext={false} />
				</ExerciseContainer>
			</View>
		</View>
	)
}
