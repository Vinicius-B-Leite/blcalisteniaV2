import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

type UseAppQueryParams<T> = {
	queryKey: unknown[]
	queryFn: () => Promise<T>
	onSuccess?(data: T): void
	onError?(): void
}
export const useAppQuery = <T>(config: UseAppQueryParams<T>) => {
	const oneSecondInMs = 1000
	const oneMinuteInMs = oneSecondInMs * 60
	const fiveMinutesInMs = oneMinuteInMs * 5

	const { isLoading, data, isSuccess, isError } = useQuery<T>({
		queryKey: config.queryKey,
		queryFn: config.queryFn,
		staleTime: fiveMinutesInMs,
	})

	useEffect(() => {
		if (isSuccess && data) {
			config.onSuccess?.(data)
			return
		}

		if (isError) {
			config.onError?.()
		}
	}, [isSuccess, data, isError])

	return {
		isLoading,
		data,
	}
}
