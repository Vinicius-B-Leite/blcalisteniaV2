import { View } from "react-native"
import { Button } from "@/components/core"
import { useAppTheme } from "@/themes/hooks/useAppTheme"
import { stylesTheme } from "./styles"
import { ActionButton } from "./ActionButton"

export const Actions = () => {
	const { theme } = useAppTheme()
	const styles = stylesTheme(theme)

	return (
		<View>
			<View style={styles.actions}>
				<ActionButton label="+ 10 segundos" isActive iconName="plus" />
				<ActionButton
					label="Pular descanso"
					isActive={false}
					iconName="return"
				/>
				<ActionButton
					label="Concluir série"
					isActive={false}
					iconName="play"
				/>
			</View>

			<Button.Root variant="primary">
				<Button.Content>01:30</Button.Content>
			</Button.Root>

			<Button.Root variant="ghost">
				<Button.Content>Editar exercício</Button.Content>
			</Button.Root>
		</View>
	)
}
