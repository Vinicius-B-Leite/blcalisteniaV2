import { useAppTheme } from "@/themes/hooks"
import { useRef, useEffect } from "react"
import { Animated } from "react-native"

export const useExerciseCard = (isSelected: boolean) => {
	const animatedValue = useRef(new Animated.Value(isSelected ? 1 : 0)).current
	const { theme } = useAppTheme()

	useEffect(() => {
		Animated.timing(animatedValue, {
			toValue: isSelected ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start()
	}, [isSelected, animatedValue])

	const rotation = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "45deg"],
	})

	const backgroundColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["transparent", theme.surface["brand-opacity-20"]],
	})

	return {
		states: {
			rotation,
			backgroundColor,
		},
	}
}
