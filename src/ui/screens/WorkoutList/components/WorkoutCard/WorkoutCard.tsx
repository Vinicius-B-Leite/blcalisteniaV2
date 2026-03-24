import { View, Image } from "react-native"
import { Text, Icon, Pressable } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { WorkoutCardProps } from "./types"
import { CATEGORY_LABELS } from "@/constants"
import { workoutBannerUtils } from "@/utils"
import { WORKOUT_LIST_SCREEN_TEST_IDS } from "../../constants"

export const WorkoutCard = ({
	title,
	exerciseCount,
	category,
	imageUrl,
	onRedirect,
	onDelete,
	id,
}: WorkoutCardProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<Pressable.Root
			onPress={onRedirect}
			style={styles.container}
			testID={WORKOUT_LIST_SCREEN_TEST_IDS.WORKOUT_ITEM}>
			<View style={styles.contentContainer}>
				{imageUrl && (
					<Image
						source={workoutBannerUtils.resolveWorkoutBanner(imageUrl)}
						style={styles.image}
						resizeMode="cover"
					/>
				)}
				<View style={styles.infoContainer}>
					<Text variant="body-small-bold" style={styles.title}>
						{title}
					</Text>
					<Text variant="body-small-reg" style={styles.subtitle}>
						{exerciseCount} exercícios
					</Text>
					<Text variant="body-small-reg" style={styles.subtitle}>
						{CATEGORY_LABELS[category]}
					</Text>
				</View>
			</View>

			<View style={styles.actionsContainer}>
				<Pressable.Root
					style={styles.iconButton}
					onPress={onRedirect}
					testID={WORKOUT_LIST_SCREEN_TEST_IDS.TO_DETAILS_BUTTON({ id })}>
					<Icon name="arrowRightTop" size={20} />
				</Pressable.Root>
				<Pressable.Root
					style={styles.iconButton}
					onPress={onDelete}
					testID={WORKOUT_LIST_SCREEN_TEST_IDS.DELETE_BUTTON({ id })}>
					<Icon name="trash" size={20} variant="error" />
				</Pressable.Root>
			</View>
		</Pressable.Root>
	)
}
