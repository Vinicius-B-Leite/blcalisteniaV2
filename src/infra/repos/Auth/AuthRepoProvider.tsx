import { createContext, useContext } from "react"
import { IAuthRepo } from "src/domain/Auth/IAuthRepo"

const AuthRepoContext = createContext({} as IAuthRepo)

export const AuthRepoProvider = AuthRepoContext.Provider

export const useAuthRepo = () => {
	const context = useContext(AuthRepoContext)
	if (!context) {
		throw new Error("useAuthRepo must be used within an AuthRepoProvider")
	}
	return context
}
