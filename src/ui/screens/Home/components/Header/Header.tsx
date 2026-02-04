import { Image, View } from "react-native"
import { Text } from "../../../../components/core/Text/Text"
import { useAppTheme } from "../../../../theme/hooks/useAppTheme"
import { stylesTheme } from "./styles"
import { Icon } from "../../../../components/core/Icon"

type HeaderProps = {
	userName: string
	onNotificationsPress: () => void
}

export function Header({ userName, onNotificationsPress }: HeaderProps) {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View style={styles.row}>
			<View style={styles.leftContent}>
				<View style={styles.avatarContainer}>
					<Image
						source={{
							uri:
								"https://ui-avatars.com/api/?name=" +
								encodeURIComponent(userName) +
								"&background=DD7700&color=fff&size=96",
						}}
						style={styles.avatar}
					/>
				</View>
				<View style={styles.textContainer}>
					<Text variant="title-large-bold">Olá, {userName}!</Text>
					<Text variant="title-small-reg">Vamos treinar hoje?</Text>
				</View>
			</View>

			<Icon
				onPress={onNotificationsPress}
				pressableStyle={styles.bellButton}
				name="icon-notification"
				size={21}
			/>
		</View>
	)
}
