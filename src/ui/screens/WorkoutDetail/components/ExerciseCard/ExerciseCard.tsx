import { View, Image } from "react-native"
import { useAppTheme } from "@/themes"
import { Text, Pressable, Icon } from "@/components/core"
import { ExerciseCard as ExerciseCardTypes } from "./types"
import { stylesTheme } from "./styles"
import { WORKOUT_DETAIL_SCREEN_TEST_IDS } from "../../constants"

const DEFAULT_BANNER = require("@/assets/imgs/exercise-card-bg.png")

export const ExerciseCard = ({
	id,
	title,
	muscleGroup,
	imageUrl,
	onPress,
	onEditPress,
	onDeletePress,
}: ExerciseCardTypes.Props) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	const CardContent = (
		<View
			style={styles.container}
			testID={onPress ? undefined : WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM}>
			<View style={styles.contentContainer}>
				<Image
					source={imageUrl ? imageUrl : DEFAULT_BANNER}
					style={styles.image}
					resizeMode="cover"
				/>
				<View style={styles.textContainer}>
					<Text variant="body-small-bold" style={styles.title}>
						{title}
					</Text>
					<Text variant="body-small-reg" style={styles.subtitle}>
						{muscleGroup}
					</Text>
				</View>
			</View>
			<View style={styles.actionsContainer}>
				<Pressable.Root
					onPress={onEditPress}
					style={styles.actionButton}
					testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON({ id })}>
					<Icon name="edit" size={20} />
				</Pressable.Root>
				<Pressable.Root
					onPress={onDeletePress}
					style={styles.actionButton}
					testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON({
						id,
					})}>
					<Icon name="trash" size={20} variant="error" />
				</Pressable.Root>
			</View>
		</View>
	)

	if (onPress) {
		return (
			<Pressable.Root
				onPress={onPress}
				testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.EXERCISE_ITEM}>
				{CardContent}
			</Pressable.Root>
		)
	}

	return CardContent
}
