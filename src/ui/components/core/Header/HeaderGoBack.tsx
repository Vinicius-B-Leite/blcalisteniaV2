import { useRouter } from "expo-router"
import { IconComponent } from "../Icon/Icon"
import { Header } from "./HeaderTypes"

export const HeaderGoBack = ({ children }: Header.GoBackProps) => {
	const router = useRouter()

	const handleGoBack = () => {
		router.back()
	}

	if (children) {
		return children
	}

	return (
		<IconComponent
			name={"leftArrow"}
			size={24}
			variant="default"
			onPress={handleGoBack}
		/>
	)
}
