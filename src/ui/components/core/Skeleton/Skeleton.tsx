import { useEffect, useRef } from "react"
import { Animated, View, ViewStyle } from "react-native"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { radius } from "../../../theme/tokens/sizes"
import { Skeleton as SkeletonTypes } from "./SkeletonTypes"

export const Skeleton = ({
	rounded = false,
	width = "100%",
	height = "100%",
	style,
	...props
}: SkeletonTypes.Props) => {
	const { theme } = useAppTheme()
	const opacity = useRef(new Animated.Value(0.3)).current

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.3,
					duration: 800,
					useNativeDriver: true,
				}),
			]),
		).start()
	}, [opacity])

	return (
		<View
			style={[
				{
					width,
					height,
					borderRadius: rounded ? radius.full : undefined,
					backgroundColor: theme.surface.container,
					overflow: "hidden",
				} as ViewStyle,
				style,
			]}
			{...props}>
			<Animated.View
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: theme.surface.container2,
					opacity,
				}}
			/>
		</View>
	)
}
