import { Redirect } from "expo-router"
import { useAuth } from "../domain/auth/AuthContext"
import { OnboardingScreen } from "@/screens"

export default function Index() {
	const { auth } = useAuth()

	if (auth?.id) {
		return <Redirect href="/home" />
	}

	return <OnboardingScreen />
}
