import { View } from "react-native"
import { Blog as BlogTypes } from "./types"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { Text, Pressable } from "@/components/core"
import { BlogCard } from "./BlogCard"

// Mock data for demonstration
const MOCK_BLOG_DATA = [
	{
		id: "1",
		title: "Como treinar usando apenas o peso do seu corpo",
		subtitle:
			"Aprenda os fundamentos da calistenia e monte treinos completos sem precisar...",
		likes: 83,
		views: 159,
	},
	{
		id: "2",
		title: "Como treinar usando apenas o peso do seu corpo",
		subtitle:
			"Aprenda os fundamentos da calistenia e monte treinos completos sem precisar...",
		likes: 83,
		views: 159,
	},
	{
		id: "3",
		title: "Como treinar usando apenas o peso do seu corpo",
		subtitle:
			"Aprenda os fundamentos da calistenia e monte treinos completos sem precisar...",
		likes: 83,
		views: 159,
	},
]

export function Blog({ onSeeMorePress }: BlogTypes.Props) {
	const styles = useStyles(stylesTheme)

	const handleCardPress = (id: string) => {
		console.log("Blog card pressed:", id)
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text variant="body-large-bold">Blog</Text>
				<Pressable.Root onPress={onSeeMorePress}>
					<Text variant="body-small-reg">Ver mais</Text>
				</Pressable.Root>
			</View>

			<View style={styles.scrollContainer}>
				{MOCK_BLOG_DATA.map((item) => (
					<BlogCard
						key={item.id}
						title={item.title}
						subtitle={item.subtitle}
						likes={item.likes}
						views={item.views}
						onPress={() => handleCardPress(item.id)}
					/>
				))}
			</View>
		</View>
	)
}
