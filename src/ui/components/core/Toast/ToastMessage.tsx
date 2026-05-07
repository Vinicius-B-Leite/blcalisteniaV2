import { Text } from "../Text/Text"
import { useToastContext } from "./ToastContext"

export const TOAST_MESSAGE_TEST_ID = "toast-message"

type ToastMessageProps = {
	children: string
}

export const ToastMessage = ({ children }: ToastMessageProps) => {
	const { variant } = useToastContext()
	return (
		<Text {...variant.message} testID={TOAST_MESSAGE_TEST_ID}>
			{children}
		</Text>
	)
}
