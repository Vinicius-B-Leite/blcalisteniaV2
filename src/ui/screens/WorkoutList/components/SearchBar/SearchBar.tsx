import { Icon, Input } from "@/components/core"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { SearchBarProps } from "./types"
import { WORKOUT_LIST_SCREEN_TEST_IDS } from "../../constants"

export const SearchBar = ({ control }: SearchBarProps) => {
	const styles = useStyles(stylesTheme)

	return (
		<Input.Root name="searchText" control={control} style={styles.root}>
			<Input.FieldWrapper>
				<Icon name="search" size={16} variant="secondary" />
				<Input.Field
					placeholder={"Buscar treino"}
					testID={WORKOUT_LIST_SCREEN_TEST_IDS.SEARCH_INPUT}
				/>
			</Input.FieldWrapper>
		</Input.Root>
	)
}
