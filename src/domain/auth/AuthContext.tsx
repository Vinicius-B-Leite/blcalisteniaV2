import { createContext, useContext, useState } from "react"
import { useSignIn } from "./useCases/useSignIn"
import { useGetCurrentUser } from "./useCases/useGetCurrentUser"
import { useLogout } from "./useCases/useLogout"

type Auth = {
	id: string
	name: string
}

type AuthContextType = {
	auth: Auth | null
	loginAsGuest(): Promise<void>
	isLoadingAuth: boolean
	logout: () => Promise<void>
}
export const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const signIn = useSignIn()
	const _logout = useLogout()
	const [auth, setAuth] = useState<Auth | null>(null)

	const getCurrentUser = useGetCurrentUser({
		onSuccess: (currentUser) => setAuth(currentUser),
	})

	const loginAsGuest = async () => {
		const guestUser: Omit<Auth, "id"> = {
			name: "Vini",
		}
		const createdUser = await signIn.execute({ name: guestUser.name })

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
