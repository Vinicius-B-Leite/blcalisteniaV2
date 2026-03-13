export interface IQueryCache {
	invalidateCacheSingle: (key: unknown[]) => Promise<void>
	invalidateCacheMultiple: (keys: unknown[][]) => Promise<void>
}
