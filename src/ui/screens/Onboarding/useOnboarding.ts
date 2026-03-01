import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../../../domain/Auth/AuthContext"
import { useAppTheme } from "@/themes"
import { useRouter } from "expo-router"

export const useOnboarding = () => {
	const router = useRouter()
	const { loginAsGuest } = useAuth()
	const insets = useSafeAreaInsets()
	const { theme } = useAppTheme()

	const handleContinueAsGuest = () => {
		loginAsGuest()
		router.navigate("/home")
	}

	return {
		actions: {
			handleContinueAsGuest,
		},
		states: {
			insets,
			theme,
		},
	}
}
