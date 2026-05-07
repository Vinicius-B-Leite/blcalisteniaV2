import { ToastRoot, TOAST_ROOT_TEST_ID } from "./ToastRoot"
import { TOAST_MESSAGE_TEST_ID } from "./ToastMessage"

export const Toast = {
	Root: ToastRoot,
	show: ToastRoot.show,
	hide: ToastRoot.hide,
}

export { TOAST_ROOT_TEST_ID, TOAST_MESSAGE_TEST_ID }
export type { Toast as ToastTypes } from "./ToastTypes"
