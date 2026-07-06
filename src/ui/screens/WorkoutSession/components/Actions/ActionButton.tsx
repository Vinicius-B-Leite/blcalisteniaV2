import { View } from "react-native"
import { Icon, Pressable, Text } from "@/components/core"
import { useAppTheme } from "@/themes/hooks/useAppTheme"
import { stylesTheme } from "./styles"
import { ActionButtonProps } from "./types"

export const ActionButton = ({
	label,
	isActive,
	iconName,
	onPress,
}: ActionButtonProps) => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<Pressable.Root onPress={onPress} style={styles.actionsButton}>
			<View style={styles.actionButtonIcon}>
				<Icon
					name={iconName}
					size={18}
					variant={isActive ? "default" : "secondary"}
				/>
			</View>

			<Text
				style={[
					styles.actionButtonText,
					!isActive && styles.actionButtonTextInactive,
				]}
				variant="body-small-bold">
				{label}
			</Text>
		</Pressable.Root>
	)
}
