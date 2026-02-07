import { createContext, useContext } from "react"
import { Button } from "./ButtonTypes"

export const ButtonContext = createContext({} as Button.ContextType)

export const ButtonProvider = ButtonContext.Provider

export const useButtonContext = () => useContext(ButtonContext)
