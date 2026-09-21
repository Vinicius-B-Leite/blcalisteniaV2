import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { usePreventRemove } from "@react-navigation/native"

type UseAppPreventGoBackParams = {
	onPrevented: () => void
}

// Intercepta a remoção da tela por qualquer via nativa (gesto de swipe no iOS,
// hardware back button no Android, back do header). Chame `confirmGoBack` para
// liberar a navegação de volta.
export const useAppPreventGoBack = ({ onPrevented }: UseAppPreventGoBackParams) => {
	const router = useRouter()
	const [hasConfirmed, setHasConfirmed] = useState(false)

	usePreventRemove(!hasConfirmed, () => {
		onPrevented()
	})

	useEffect(() => {
		if (hasConfirmed) router.back()
	}, [hasConfirmed, router])

	const confirmGoBack = () => setHasConfirmed(true)

	return { confirmGoBack }
}
