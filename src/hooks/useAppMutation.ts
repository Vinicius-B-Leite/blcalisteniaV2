import { useMutation } from "@tanstack/react-query"

type UseAppMutationParams<ReturnMutationFn, Variables> = {
	mutationFn: (variables: Variables) => Promise<ReturnMutationFn>
	onSuccess?(): void
	onError?(err: unknown): void
}
export const useAppMutation = <ReturnMutationFn, Variables>({
	mutationFn,
	onSuccess,
	onError,
}: UseAppMutationParams<ReturnMutationFn, Variables>) => {
	const mutate = useMutation({
		mutationFn,
		onSuccess: () => {
			onSuccess?.()
		},
		onError: (err) => {
			onError?.(err)
		},
	})

	const execute = async (variables: Variables) => {
		return await mutate.mutateAsync(variables)
	}

	return { execute, isLoading: mutate.isPending }
}
