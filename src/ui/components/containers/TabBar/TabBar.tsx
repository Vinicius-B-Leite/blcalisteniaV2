import { View, TouchableOpacity, Animated } from "react-native"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Icon, IconType } from "../../core/Icon"
import { useStyles } from "../../../theme/hooks/useStyles"
import { createStyles, TAB_BAR_INDICATOR_SIZE, TAB_GAP } from "./styles"
import { useEffect, useRef } from "react"
import { spacings } from "../../../theme/tokens/spacings"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type TabBarIconMap = {
	[key: string]: {
		icon: IconType.Names
		label: string
	}
}

const tabBarIcons: TabBarIconMap = {
	home: {
		icon: "home",
		label: "Home",
	},
	workout: {
		icon: "dumbbells",
		label: "Treino",
	},
	history: {
		icon: "calendar",
		label: "Histórico",
	},
	profile: {
		icon: "user",
		label: "Perfil",
	},
}

export const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
	const insets = useSafeAreaInsets()
	const styles = useStyles((theme) => createStyles(theme, insets))
	const translateX = useRef(new Animated.Value(0)).current

	useEffect(() => {
		const position = state.index * (TAB_BAR_INDICATOR_SIZE + TAB_GAP)
		Animated.spring(translateX, {
			toValue: position,
			useNativeDriver: true,
			tension: 68,
			friction: 12,
		}).start()
	}, [state.index])

	return (
		<View style={styles.container}>
			<View style={styles.tabBar}>
				<Animated.View
					pointerEvents="none"
					style={[
						styles.activeIndicator,
						{
							transform: [{ translateX }],
						},
					]}
				/>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key]
					const isFocused = state.index === index

					const onPress = () => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true,
						})

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name)
						}
					}

					const onLongPress = () => {
						navigation.emit({
							type: "tabLongPress",
							target: route.key,
						})
					}

					const tabConfig = tabBarIcons[route.name] || {
						icon: "home" as IconType.Names,
						label: route.name,
					}

					return (
						<TouchableOpacity
							key={route.key}
							accessibilityRole="button"
							accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={
								options.tabBarAccessibilityLabel ??
								tabConfig.label ??
								route.name
							}
							onPress={onPress}
							onLongPress={onLongPress}
							style={[
								styles.tabButton,
								isFocused && styles.tabButtonActive,
							]}>
							<Icon name={tabConfig.icon} size={27.5} variant="default" />
						</TouchableOpacity>
					)
				})}
			</View>
		</View>
	)
}
