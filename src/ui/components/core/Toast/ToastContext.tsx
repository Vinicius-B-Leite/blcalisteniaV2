import { createContext, useContext } from "react"
import { Toast } from "./ToastTypes"

export const ToastContext = createContext({} as Toast.ContextType)

export const ToastProvider = ToastContext.Provider

export const useToastContext = () => {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error("Toast sub-components must be used within Toast.Root")
	}
	return context
}
