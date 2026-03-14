import { IQueryCache } from "../../IQueryCache"
import { queryClient } from "./ReactQueryProvider"

export const ReactQueryService: IQueryCache = {
	invalidateCacheSingle: async (key: unknown[]) => {
		await queryClient.invalidateQueries({ queryKey: key })
	},

	invalidateCacheMultiple: async (keys: unknown[][]) => {
		await Promise.all(
			keys.map(async (key) => {
				await queryClient.invalidateQueries({ queryKey: key })
			}),
		)
	},
}
