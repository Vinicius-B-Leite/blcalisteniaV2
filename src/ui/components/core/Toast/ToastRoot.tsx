import {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
	createRef,
	useEffect,
} from "react"
import { Animated, StyleSheet, View } from "react-native"
import { useAppTheme } from "@/themes"
import { Toast } from "./ToastTypes"
import { ToastProvider } from "./ToastContext"
import { ToastMessage } from "./ToastMessage"
import { toastVariants } from "./ToastVariants"

const ANIMATION_DURATION = 300
const DEFAULT_DURATION = 3000
const TOAST_BOTTOM_OFFSET = 48

export const TOAST_ROOT_TEST_ID = "toast-root"

const moduleRef = createRef<Toast.Handle>()

const ToastInner = forwardRef<Toast.Handle>((_, ref) => {
	const { theme } = useAppTheme()
	const [visible, setVisible] = useState(false)
	const [toastProps, setToastProps] = useState<Toast.ShowProps | null>(null)
	const translateY = useRef(new Animated.Value(100)).current
	const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	const hide = () => {
		Animated.timing(translateY, {
			toValue: 100,
			duration: ANIMATION_DURATION,
			useNativeDriver: true,
		}).start(() => {
			setVisible(false)
			setToastProps(null)
		})
	}

	const show = (props: Toast.ShowProps) => {
		if (hideTimer.current) {
			clearTimeout(hideTimer.current)
		}

		setToastProps(props)
		setVisible(true)
		translateY.setValue(100)

		Animated.spring(translateY, {
			toValue: 0,
			tension: 100,
			friction: 8,
			useNativeDriver: true,
		}).start()

		const duration = props.duration ?? DEFAULT_DURATION
		hideTimer.current = setTimeout(hide, duration)
	}

	useEffect(() => {
		return () => {
			if (hideTimer.current) {
				clearTimeout(hideTimer.current)
			}
		}
	}, [])

	useImperativeHandle(ref, () => ({ show, hide }))

	if (!visible || !toastProps) return null

	const variants = toastVariants(theme)
	const currentVariant = variants[toastProps.variant]

	return (
		<ToastProvider value={{ variant: currentVariant, props: toastProps }}>
			<Animated.View
				style={[styles.wrapper, { transform: [{ translateY }] }]}
				pointerEvents="none">
				<View style={currentVariant.container} testID={TOAST_ROOT_TEST_ID}>
					{toastProps.left}
					<ToastMessage>{toastProps.message}</ToastMessage>
					{toastProps.right}
				</View>
			</Animated.View>
		</ToastProvider>
	)
})

ToastInner.displayName = "ToastInner"

const ToastRoot = () => <ToastInner ref={moduleRef} />

ToastRoot.show = (props: Toast.ShowProps) => moduleRef.current?.show(props)
ToastRoot.hide = () => moduleRef.current?.hide()

const styles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		bottom: TOAST_BOTTOM_OFFSET,
		left: 0,
		right: 0,
		alignItems: "center",
		zIndex: 9999,
	},
})

export { ToastRoot }
