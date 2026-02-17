import { useRouter } from "expo-router"
import { Icon } from "@/components/core"
import { Header } from "./HeaderTypes"

export const HeaderGoBack = ({ children }: Header.GoBackProps) => {
	const router = useRouter()

	const handleGoBack = () => {
		router.back()
	}

	if (children) {
		return children
	}

	return <Icon name={"leftArrow"} size={24} variant="default" onPress={handleGoBack} />
}
