export namespace CategoryFilter {
	export type Props = {
		categories: string[]
		selectedCategory: string
		onSelectCategory: (category: string) => void
	}

	export type ChipProps = {
		label: string
		isSelected: boolean
		onPress: () => void
	}
}
