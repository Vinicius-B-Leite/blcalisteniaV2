import { PropsWithChildren } from "react"
import { StyleProp, ViewStyle, ViewProps, ImageSourcePropType } from "react-native"
import { Text } from "../../core/Text/TextTypes"
import { Pressable } from "../../core/Pressable/PressableTypes"
import { workoutBannerCardVariantsKeys } from "./WorkoutBannerCardVariants"

export namespace WorkoutBannerBannerCard {
	export type VariantsKeys = keyof typeof workoutBannerCardVariantsKeys

	export type Variant = {
		container: StyleProp<ViewStyle>
		image: StyleProp<ViewStyle>
		overlay: StyleProp<ViewStyle>
		row: StyleProp<ViewStyle>
		content: StyleProp<ViewStyle>
		textContainer: StyleProp<ViewStyle>
		title: Text.Props
		subtitle: Text.Props
		tagsContainer: StyleProp<ViewStyle>
		tag: StyleProp<ViewStyle>
		tagText: Text.Props
		editButton: Pressable.RootProps
	}

	export type RootProps = PropsWithChildren<
		ViewProps & {
			variant?: VariantsKeys
			imageUrl?: ImageSourcePropType
		} & {
			onPress?: () => void
		}
	>

	export type ContentProps = PropsWithChildren

	export type TitleProps = PropsWithChildren

	export type SubtitleProps = PropsWithChildren

	export type TagsProps = PropsWithChildren

	export type TagProps = PropsWithChildren

	export type EditButtonProps = {
		onPress?: () => void
	}

	export type ContextType = {
		variant: Variant
	}
}
