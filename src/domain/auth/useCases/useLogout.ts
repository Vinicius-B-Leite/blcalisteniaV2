import { useAppMutation } from "@/hooks"
import { useAuthRepo } from "@/repos/Auth"

export const useLogout = () => {
	const authRepo = useAuthRepo()

	const { execute, isLoading } = useAppMutation<void, void>({
		mutationFn: authRepo.logout,
		onError: (err) => {
			console.log("Error logging out :(", err)
		},
	})

	return { execute, isLoading }
}
