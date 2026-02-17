import { createContext, useContext } from "react"
import { Input } from "./InputTypes"

export const InputContext = createContext({} as Input.ContextType)

export const InputProvider = InputContext.Provider

export const useInputContext = () => {
	const context = useContext(InputContext)
	if (!context?.variant) {
		throw new Error("Input sub-components must be used within Input")
	}
	return context
}
