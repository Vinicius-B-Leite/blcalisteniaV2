import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "@/domains/Auth"
import { useAppTheme } from "@/themes"

export const useHome = () => {
	const insets = useSafeAreaInsets()
	const { theme } = useAppTheme()
	const { auth, logout } = useAuth()

	const handleNotificationsPress = () => {
		logout()
	}

	const handleSeeMoreBlog = () => {}

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
