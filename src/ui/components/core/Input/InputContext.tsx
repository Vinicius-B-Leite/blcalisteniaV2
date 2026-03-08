import { createContext, useContext } from "react"
import { FieldValues } from "react-hook-form"
import { Input } from "./InputTypes"

export const InputContext = createContext({} as Input.ContextType)

export const InputProvider = InputContext.Provider

export const useInputContext = <T extends FieldValues = any>() => {
	const context = useContext(InputContext) as Input.ContextType<T>
	if (!context?.variant) {
		throw new Error("Input sub-components must be used within Input")
	}
	return context
}
