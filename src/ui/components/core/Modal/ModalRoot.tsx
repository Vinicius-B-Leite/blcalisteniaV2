import {
	Modal as RNModal,
	TouchableWithoutFeedback,
	Animated,
	Dimensions,
} from "react-native"
import { Modal } from "./ModalTypes"
import { ModalProvider } from "./ModalContext"
import { useAppTheme } from "../../../theme/hooks/useAppTheme"
import { createStyles } from "./styles"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useEffect, useRef } from "react"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")

export const ModalRoot = ({ children, onClose, visible }: Modal.RootProps) => {
	const { theme } = useAppTheme()
	const insets = useSafeAreaInsets()
	const styles = createStyles(theme, insets.bottom)

	const overlayOpacity = useRef(new Animated.Value(0)).current
	const containerTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current

	const handleClose = () => {
		Animated.parallel([
			Animated.timing(overlayOpacity, {
				toValue: 0,
				duration: 250,
				useNativeDriver: true,
			}),
			Animated.timing(containerTranslateY, {
				toValue: SCREEN_HEIGHT,
				duration: 250,
				useNativeDriver: true,
			}),
		]).start(() => {
			onClose()
		})
	}

	useEffect(() => {
		if (visible) {
			overlayOpacity.setValue(0)
			containerTranslateY.setValue(SCREEN_HEIGHT)

			Animated.parallel([
				Animated.timing(overlayOpacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.spring(containerTranslateY, {
					toValue: 0,
					damping: 20,
					stiffness: 90,
					useNativeDriver: true,
				}),
			]).start()
		}
	}, [visible, overlayOpacity, containerTranslateY, SCREEN_HEIGHT])

	return (
		<RNModal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={handleClose}
			statusBarTranslucent>
			<ModalProvider value={{ onClose: handleClose }}>
				<TouchableWithoutFeedback onPress={handleClose}>
					<Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
						<TouchableWithoutFeedback>
							<Animated.View
								style={[
									styles.container,
									{ transform: [{ translateY: containerTranslateY }] },
								]}>
								{children}
							</Animated.View>
						</TouchableWithoutFeedback>
					</Animated.View>
				</TouchableWithoutFeedback>
			</ModalProvider>
		</RNModal>
	)
}
