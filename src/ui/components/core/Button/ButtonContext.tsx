import { createContext, useContext } from "react"
import { ButtonVariant } from "./ButtonRoot"

type ButtonContextType = {
	variant: ButtonVariant
}
export const ButtonContext = createContext({} as ButtonContextType)

export const ButtonProvider = ButtonContext.Provider

export const useButtonContext = () => useContext(ButtonContext)
