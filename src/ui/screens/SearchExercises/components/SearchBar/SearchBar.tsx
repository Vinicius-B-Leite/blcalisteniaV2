import { Icon, Input } from "@/components/core"
import { SearchBar as SearchBarTypes } from "./types"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "../../constants"

export function SearchBar({ control }: SearchBarTypes.Props) {
	return (
		<Input.Root name="searchText" control={control}>
			<Input.FieldWrapper>
				<Icon name="search" size={16} variant="secondary" />
				<Input.Field
					placeholder={"Buscar exercícios"}
					testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.SEARCH_INPUT}
				/>
			</Input.FieldWrapper>
		</Input.Root>
	)
}
