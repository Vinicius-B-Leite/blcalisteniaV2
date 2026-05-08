import { useInfiniteQuery } from "@tanstack/react-query"
import { PaginatedResult } from "@/types/pagination"

export type UseAppInfiniteQueryParams<T> = {
	queryKey: unknown[]
	queryFn: (page: number) => Promise<PaginatedResult<T>>
	enabled?: boolean
}

export const useAppInfiniteQuery = <T>(params: UseAppInfiniteQueryParams<T>) => {
	return useInfiniteQuery<PaginatedResult<T>>({
		queryKey: params.queryKey,
		queryFn: ({ pageParam }) => params.queryFn(pageParam as number),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasNextPage ? allPages.length : undefined,
		enabled: params.enabled ?? true,
	})
}
