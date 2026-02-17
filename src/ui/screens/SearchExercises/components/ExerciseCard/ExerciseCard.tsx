import { View, Image, Animated, TouchableOpacity } from "react-native"
import { useStyles, useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"
import { ExerciseCard as ExerciseCardTypes } from "./types"
import { Text, Icon } from "@/components/core"
import { useExerciseCard } from "./useExerciseCard"

export function ExerciseCard({
	title,
	category,
	imageUrl,
	onAdd,
	showImage = true,
}: ExerciseCardTypes.Props) {
	const styles = useStyles(stylesTheme)
	const { states, actions } = useExerciseCard()

	const handlePress = () => {
		actions.toggleSelection()
		onAdd?.()
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				{showImage && imageUrl && (
					<Image
						source={{ uri: imageUrl }}
						style={styles.image}
						resizeMode="cover"
					/>
				)}
				<View style={styles.textContainer}>
					<Text variant="body-small-bold" numberOfLines={1}>
						{title}
					</Text>
					<Text variant="body-small-reg" numberOfLines={1}>
						{category}
					</Text>
				</View>
			</View>
			<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
				<Animated.View
					style={[
						styles.iconButton,
						{
							backgroundColor: states.backgroundColor,
							transform: [{ rotate: states.rotation }],
						},
					]}>
					<Icon
						name={"plus"}
						size={20}
						variant={states.isSelected ? "brand" : "default"}
					/>
				</Animated.View>
			</TouchableOpacity>
		</View>
	)
}
