import { authQueryKeys, useAuthRepo } from "src/infra/repos"
import { AuthModel } from "../AuthModel"
import { useAppQuery } from "src/hooks"

type UseGetCurrentUserParams = {
	onSuccess?(data: AuthModel): void
	onError?(): void
}

export const useGetCurrentUser = ({
	onError,
	onSuccess,
}: UseGetCurrentUserParams = {}) => {
	const authRepo = useAuthRepo()

	const { isLoading, data } = useAppQuery<AuthModel | null>({
		queryKey: [authQueryKeys.getCurrentUser],
		queryFn: () => authRepo.getCurrentUser(),
		onError,
		onSuccess,
	})

	return { isLoading, data }
}
