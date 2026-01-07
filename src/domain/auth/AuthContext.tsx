import { createContext, useContext, useState } from "react"

type Auth = {
	id: string
}

type AuthContextType = {
	auth: Auth | null
	loginAsGuest(): void
}
export const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [auth, setAuth] = useState<Auth | null>(null)

	const loginAsGuest = () => {
		const guestUser: Auth = {
			id: "guest",
		}
		setAuth(guestUser)
	}

	return (
		<AuthContext.Provider value={{ auth, loginAsGuest }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
