import { authQueryKeys, useAuthRepo } from "@/repos/Auth"
import { AuthModel } from "../AuthModel"
import { useAppQuery } from "@/hooks"
import { ComumParamsUseCase } from "@/types/comumParamsUseCase"

export const useGetCurrentUser = ({
	onError,
	onSuccess,
}: ComumParamsUseCase<AuthModel, unknown> = {}) => {
	const authRepo = useAuthRepo()

	const { isLoading, data } = useAppQuery<AuthModel | null>({
		queryKey: [authQueryKeys.getCurrentUser],
		queryFn: () => authRepo.getCurrentUser(),
		onError,
		onSuccess,
	})

	return { isLoading, data }
}
