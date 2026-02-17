import { ImageBackground, View } from "react-native"
import Svg, { Path } from "react-native-svg"
import { useAppTheme } from "@/themes"
import { Text, Pressable, Icon } from "@/components/core"
import { WorkoutCard as WorkoutCardTypes } from "./types"
import { stylesTheme } from "./styles"

const MOCK_IMAGE = require("@/assets/imgs/workout-banner-1.png")

export const WorkoutCard = ({
	title,
	subtitle,
	category,
	day,
	imageUrl,
	onEditPress,
}: WorkoutCardTypes.Props) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View style={styles.container}>
			<ImageBackground
				source={imageUrl ?? MOCK_IMAGE}
				style={styles.image}
				resizeMode="cover">
				<View style={styles.overlay}>
					<View style={styles.row}>
						<View style={styles.contentContainer}>
							<View style={styles.textContainer}>
								<Text variant="body-large-bold" style={styles.title}>
									{title}
								</Text>
								<Text variant="caption-reg" style={styles.subtitle}>
									{subtitle}
								</Text>
							</View>
							<View style={styles.tagsContainer}>
								<View style={styles.tag}>
									<Text variant="caption-reg" style={styles.tagText}>
										{category}
									</Text>
								</View>
								<View style={styles.tag}>
									<Text variant="caption-reg" style={styles.tagText}>
										{day}
									</Text>
								</View>
							</View>
						</View>
						<Pressable.Root onPress={onEditPress} style={styles.editButton}>
							<Icon name="edit" size={24} />
						</Pressable.Root>
					</View>
				</View>
			</ImageBackground>
		</View>
	)
}
