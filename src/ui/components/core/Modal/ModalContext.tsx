import { createContext, useContext } from "react"
import { Modal } from "./ModalTypes"

export const ModalContext = createContext<Modal.ContextType>({
	onClose: () => {},
})

export const ModalProvider = ModalContext.Provider

export const useModalContext = () => {
	const context = useContext(ModalContext)
	return context
}
