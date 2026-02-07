import { createContext, useContext } from "react"
import { Pressable } from "./PressableTypes"

export const PressableContext = createContext({} as Pressable.ContextType)

export const PressableProvider = PressableContext.Provider

export const usePressableContext = () => useContext(PressableContext)
