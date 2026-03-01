import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../../../domain/Auth/AuthContext"
import { useAppTheme } from "@/themes"

export const useHome = () => {
	const insets = useSafeAreaInsets()
	const { theme } = useAppTheme()
	const { auth, logout } = useAuth()

	const handleNotificationsPress = () => {
		// TODO: navigate to notifications
		logout()
	}

	const handleSeeMoreBlog = () => {
		// TODO: navigate to blog list
	}

	return {
		actions: { handleNotificationsPress, handleSeeMoreBlog },
		states: {
			insets,
			theme,
			userName: auth?.name ?? "Usuário",
		},
		refs: {},
	}
}
