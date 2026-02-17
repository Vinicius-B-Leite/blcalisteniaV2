import { useAppTheme } from "@/themes/hooks"
import { useState, useRef } from "react"
import { Animated } from "react-native"

export const useExerciseCard = () => {
	const [isSelected, setIsSelected] = useState(false)
	const animatedValue = useRef(new Animated.Value(0)).current
	const { theme } = useAppTheme()

	const toggleSelection = () => {
		const newValue = !isSelected

		Animated.timing(animatedValue, {
			toValue: newValue ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start()

		setIsSelected(newValue)
	}

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
			isSelected,
			rotation,
			animatedValue,
			backgroundColor,
		},
		actions: {
			toggleSelection,
		},
	}
}
