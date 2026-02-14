import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../../../domain/auth/AuthContext"
import { useAppTheme } from "@/themes"

export const useHome = () => {
	const insets = useSafeAreaInsets()
	const { theme } = useAppTheme()
	const { auth } = useAuth()

	const handleNotificationsPress = () => {
		// TODO: navigate to notifications
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
