import { View } from "react-native"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { PropsWithChildren } from "react"
import { StatusBar } from "expo-status-bar"
import { spacings } from "../../../theme/tokens/spacings"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const Screen = ({ children }: PropsWithChildren) => {
	const { theme } = useAppTheme()
	const { bottom, top } = useSafeAreaInsets()

	return (
		<View
			style={{
				backgroundColor: theme.surface.background,
				flex: 1,
				paddingHorizontal: spacings.padding[20],
				paddingTop: Math.max(top, spacings.padding[20]),
				paddingBottom: Math.max(bottom, spacings.padding[20]),
			}}>
			<StatusBar style={theme.mode === "dark" ? "light" : "dark"} translucent />
			{children}
		</View>
	)
}
