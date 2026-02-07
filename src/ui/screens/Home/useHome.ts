import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../../../domain/auth/AuthContext"
import { useAppTheme } from "../../theme/hooks/useAppTheme"

export const useHome = () => {
	const insets = useSafeAreaInsets()
	const { theme } = useAppTheme()
	const { auth } = useAuth()

	const handleNotificationsPress = () => {
		// TODO: navigate to notifications
	}

	return {
		actions: { handleNotificationsPress },
		states: {
			insets,
			theme,
			userName: auth?.name ?? "Usuário",
		},
		refs: {},
	}
}
