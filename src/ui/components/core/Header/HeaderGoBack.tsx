import { useRouter } from "expo-router"
import { Icon } from "../Icon"
import { Header } from "./HeaderTypes"
import { Pressable } from "../Pressable"

export const HeaderGoBack = ({ children }: Header.GoBackProps) => {
	const router = useRouter()

	const handleGoBack = () => {
		console.log("Go back")
		router.back()
	}

	if (children) {
		return children
	}

	return (
		<Icon
			name={"leftArrow"}
			size={24}
			onPress={handleGoBack}
			pressableStyle={{ zIndex: 20 }}
		/>
	)
}
