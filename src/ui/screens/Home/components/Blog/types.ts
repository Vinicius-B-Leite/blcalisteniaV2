export namespace Blog {
	export type Props = {
		onSeeMorePress?: () => void
	}

	export type CardProps = {
		title: string
		subtitle: string
		likes: number
		views: number
		onPress?: () => void
	}
}
