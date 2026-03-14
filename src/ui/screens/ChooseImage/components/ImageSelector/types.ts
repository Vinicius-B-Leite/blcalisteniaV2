import { ImageSourcePropType } from "react-native"

export namespace ImageSelector {
	export type Props = {
		selectedImage?: string
		onImageSelect: (imageId: string) => void
		onAddImage: () => void
		isAddingImage?: boolean
	}

	export type ImageOption = {
		id: string
		source: ImageSourcePropType
	}

	export type ImageItemProps = {
		id: string
		source: ImageSourcePropType
		isSelected: boolean
		onPress: (id: string) => void
	}

	export type AddImageItemProps = {
		onPress: () => void
		isLoading?: boolean
	}
}
