import { Icon, Input } from "@/components/core"
import { SearchBar as SearchBarTypes } from "./types"

export function SearchBar({ placeholder, value, onChangeText }: SearchBarTypes.Props) {
	return (
		<Input.Root>
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
