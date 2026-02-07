import { useRef } from "react"
import { Animated } from "react-native"
import { Pressable as RNPressable } from "react-native"
import { Pressable } from "./PressableTypes"
import { PressableProvider } from "./PressableContext"

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable)

export const PressableRoot = ({
	children,
	style,
	scaleOnPress = 0.96,
	opacityOnPress = 0.85,
	...props
}: Pressable.RootProps) => {
	const scale = useRef(new Animated.Value(1)).current
	const opacity = useRef(new Animated.Value(1)).current

	const animateIn = () => {
		Animated.parallel([
			Animated.spring(scale, {
				toValue: scaleOnPress,
				useNativeDriver: true,
				speed: 20,
				bounciness: 0,
			}),
			Animated.timing(opacity, {
				toValue: opacityOnPress,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start()
	}

	const animateOut = () => {
		Animated.parallel([
			Animated.spring(scale, {
				toValue: 1,
				useNativeDriver: true,
				speed: 20,
				bounciness: 0,
			}),
			Animated.timing(opacity, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start()
	}

	return (
		<PressableProvider value={{ scaleOnPress, opacityOnPress }}>
			<AnimatedPressable
				{...props}
				style={[
					style,
					{
						transform: [{ scale }],
						opacity,
					},
				]}
				onPressIn={(e) => {
					animateIn()
					props.onPressIn && props.onPressIn(e)
				}}
				onPressOut={(e) => {
					animateOut()
					props.onPressOut && props.onPressOut(e)
				}}>
				{children}
			</AnimatedPressable>
		</PressableProvider>
	)
}
