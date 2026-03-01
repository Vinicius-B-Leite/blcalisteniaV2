import { useAppMutation } from "src/hooks"
import { useAuthRepo } from "src/infra/repos"
import { AuthModel } from "../AuthModel"

export const useSignIn = () => {
	const authRepo = useAuthRepo()

	const { execute, isLoading } = useAppMutation<AuthModel, { name: string }>({
		mutationFn: (variables) => authRepo.signInAnonymous({ name: variables.name }),
		onError: (err) => {
			console.log("Error signing in :(", err)
		},
	})

	return { execute, isLoading }
}
