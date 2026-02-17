import { View, Image } from "react-native"
import { Text, Icon, Pressable } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { WorkoutCardProps } from "./types"

export const WorkoutCard = ({
	title,
	exerciseCount,
	category,
	imageUrl,
	onRedirect,
	onDelete,
}: WorkoutCardProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				{imageUrl && (
					<Image
						source={{ uri: imageUrl }}
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
						{category}
					</Text>
				</View>
			</View>

			<View style={styles.actionsContainer}>
				<Pressable.Root style={styles.iconButton} onPress={onRedirect}>
					<Icon name="arrowRightTop" size={20} />
				</Pressable.Root>
				<Pressable.Root style={styles.iconButton} onPress={onDelete}>
					<Icon name="trash" size={20} variant="error" />
				</Pressable.Root>
			</View>
		</View>
	)
}
