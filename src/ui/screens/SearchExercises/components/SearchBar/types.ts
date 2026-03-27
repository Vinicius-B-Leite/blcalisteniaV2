import { Control } from "react-hook-form"

export namespace SearchBar {
	export type Props = {
		control: Control<{ searchText: string }>
	}
}
