import { useEffect, useRef } from "react"
import { Animated } from "react-native"
import { useAppTheme } from "@/themes/hooks"

export const useSerieItem = (completed: boolean) => {
	const { theme } = useAppTheme()

	const progress = useRef(new Animated.Value(completed ? 1 : 0)).current
	const checkScale = useRef(new Animated.Value(completed ? 1 : 0)).current

	useEffect(() => {
		Animated.timing(progress, {
			toValue: completed ? 1 : 0,
			duration: 250,
			useNativeDriver: false,
		}).start()

		Animated.spring(checkScale, {
			toValue: completed ? 1 : 0,
			friction: 5,
			tension: 140,
			useNativeDriver: true,
		}).start()
	}, [completed, progress, checkScale])

	const backgroundColor = progress.interpolate({
		inputRange: [0, 1],
		outputRange: [theme.surface.container, theme.surface.brand],
	})

	const borderColor = progress.interpolate({
		inputRange: [0, 1],
		outputRange: [theme.border.default, theme.surface.brand],
	})

	return {
		states: {
			backgroundColor,
			borderColor,
			checkScale,
		},
	}
}
