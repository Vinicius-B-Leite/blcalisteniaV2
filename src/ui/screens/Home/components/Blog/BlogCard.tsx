import { View } from "react-native"
import { Blog } from "./types"
import { useStyles } from "../../../../theme/hooks/useStyles"
import { stylesTheme } from "./styles"
import { Text } from "../../../../components/core/Text"
import { Pressable } from "../../../../components/core/Pressable"
import { IconComponent } from "../../../../components/core/Icon/Icon"
import { useAppTheme } from "../../../../theme/hooks/useAppTheme"

export function BlogCard({ title, subtitle, likes, views, onPress }: Blog.CardProps) {
	const styles = useStyles(stylesTheme)
	const { theme } = useAppTheme()

	return (
		<Pressable.Root onPress={onPress} style={styles.card}>
			<View style={styles.cardContent}>
				<View style={styles.textContainer}>
					<Text variant="body-small-bold" numberOfLines={2}>
						{title}
					</Text>
					<Text variant="body-small-reg" numberOfLines={2}>
						{subtitle}
					</Text>
				</View>

				<View style={styles.statsContainer}>
					<View style={styles.statBadge}>
						<IconComponent name="heart" size={14} variant="default" />
						<Text variant="caption-reg">{likes}</Text>
					</View>

					<View style={styles.statBadge}>
						<IconComponent name="eye" size={14} variant="default" />
						<Text variant="caption-reg">{views}</Text>
					</View>
				</View>
			</View>

			<View style={styles.thumbnail}>
				<Text
					variant="body-small-bold"
					style={{ color: theme.content["text-variant"] }}>
					Thumb
				</Text>
			</View>
		</Pressable.Root>
	)
}
