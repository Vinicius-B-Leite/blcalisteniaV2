import { createContext, useContext, useState } from "react"
import { useLogout, useGetCurrentUser, useSignInAsGuest } from "./useCases"
import { AuthModel } from "./AuthModel"

type AuthContextType = {
	auth: AuthModel | null
	loginAsGuest(): Promise<void>
	isLoadingAuth: boolean
	logout: () => Promise<void>
}
export const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const signInAsGuest = useSignInAsGuest()
	const _logout = useLogout()
	const [auth, setAuth] = useState<AuthModel | null>(null)

	const getCurrentUser = useGetCurrentUser({
		onSuccess: (currentUser) => setAuth(currentUser),
	})

	const loginAsGuest = async () => {
		const guestUser: Omit<AuthModel, "id"> = {
			name: "Vini",
		}
		const createdUser = await signInAsGuest.execute({ name: guestUser.name })

		if (createdUser) {
			setAuth(createdUser)
		}
	}

	const logout = async () => {
		await _logout.execute()
		setAuth(null)
	}

	return (
		<AuthContext.Provider
			value={{
				auth,
				loginAsGuest,
				isLoadingAuth: getCurrentUser.isLoading,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
