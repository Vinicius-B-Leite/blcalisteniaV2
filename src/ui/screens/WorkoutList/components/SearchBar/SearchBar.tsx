import { Icon, Input } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { SearchBarProps } from "./types"

export const SearchBar = ({ control }: SearchBarProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<Input.Root name="searchText" control={control} style={styles.root}>
			<Input.FieldWrapper>
				<Icon name="search" size={16} variant="secondary" />
				<Input.Field placeholder={"Buscar treino"} />
			</Input.FieldWrapper>
		</Input.Root>
	)
}
