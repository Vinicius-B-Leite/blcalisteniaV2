export type PaginationParams = {
	page: number
	limit: number
}

export type PaginatedResult<T> = {
	items: T[]
	hasNextPage: boolean
}
