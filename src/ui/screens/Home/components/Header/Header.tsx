import { Image, View } from "react-native"
import { Text, Icon } from "@/components/core"
import { useAppTheme } from "@/themes"
import { stylesTheme } from "./styles"

type HeaderProps = {
	userName: string
	onNotificationsPress: () => void
}

export const Header = ({ userName, onNotificationsPress }: HeaderProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View style={styles.row}>
			<View style={styles.leftContent}>
				<View style={styles.avatarContainer}>
					<View style={styles.avatar}>
						<Text variant="title-large-bold">
							{userName.charAt(0).toUpperCase()}
						</Text>
						<Text variant="title-large-bold">
							{userName.charAt(1).toUpperCase()}
						</Text>
					</View>
				</View>
				<View style={styles.textContainer}>
					<Text variant="title-large-bold">Olá, {userName}!</Text>
					<Text variant="title-small-reg">Vamos treinar hoje?</Text>
				</View>
			</View>

			<Icon
				onPress={onNotificationsPress}
				pressableStyle={styles.bellButton}
				name="notification"
				size={26}
			/>
		</View>
	)
}
