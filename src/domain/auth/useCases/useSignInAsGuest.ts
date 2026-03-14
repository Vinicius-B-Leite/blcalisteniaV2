import { useAppMutation } from "@/hooks"
import { useAuthRepo } from "@/repos/Auth"
import { AuthModel } from "../AuthModel"

export const useSignInAsGuest = () => {
	const authRepo = useAuthRepo()

	const { execute, isLoading } = useAppMutation<AuthModel, { name: string }>({
		mutationFn: (variables) => authRepo.signInAnonymous({ name: variables.name }),
		onError: (err) => {
			console.log("Error signing in as guest :(", err)
		},
	})

	return { execute, isLoading }
}
