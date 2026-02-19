import { Icon, Input } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { SearchBarProps } from "./types"

export const SearchBar = ({
	value,
	onChangeText,
	placeholder = "Buscar treino",
}: SearchBarProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<Input.Root style={styles.root}>
			<Input.FieldWrapper>
				<Icon name="search" size={16} variant="secondary" />
				<Input.Field
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
				/>
			</Input.FieldWrapper>
		</Input.Root>
	)
}
