import { ScrollView, StyleProp, View, ViewStyle } from "react-native"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { StatusBar } from "expo-status-bar"
import { spacings } from "../../../theme/tokens/spacings"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Screen as ScreenTypes } from "./ScreenTypes"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"

export const Screen = ({
	children,
	scrollable = false,
	nestedScrollEnabled = false,
	style,
	...rest
}: ScreenTypes.Props) => {
	const { theme } = useAppTheme()
	const { bottom, top } = useSafeAreaInsets()

	const height = useBottomTabBarHeight()

	const containerStyle: StyleProp<ViewStyle> = [
		{
			backgroundColor: theme.surface.background,
			flex: 1,
			height: "100%",
			paddingHorizontal: spacings.padding[20],
			paddingTop: Math.max(top, spacings.padding[20]) + spacings.padding[4],
			paddingBottom: Math.max(bottom, spacings.padding[20]) + height,
		},
		...[scrollable ? [] : [style]],
	]

	const contentContainerStyle: StyleProp<ViewStyle> = [
		{
			paddingBottom: Math.max(bottom, spacings.padding[20]) + height,
		},
		...[scrollable ? [style] : []],
	]

	const Container = scrollable ? ScrollView : View

	return (
		<Container
			style={containerStyle}
			contentContainerStyle={contentContainerStyle}
			showsVerticalScrollIndicator={false}
			{...rest}>
			<StatusBar style={theme.mode === "dark" ? "light" : "dark"} translucent />
			{children}
		</Container>
	)
}
