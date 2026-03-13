import { createContext, PropsWithChildren, useContext } from "react"
import { IQueryCache } from "./IQueryCache"
import { QueryCacheServiceProvider } from "./implementations"

const QueryCacheContext = createContext({} as IQueryCache)

export const QueryCacheProvider = ({
	children,
	value,
}: PropsWithChildren<{ value: IQueryCache }>) => {
	return (
		<QueryCacheServiceProvider>
			<QueryCacheContext.Provider value={value}>
				{children}
			</QueryCacheContext.Provider>
		</QueryCacheServiceProvider>
	)
}

export const useQueryCache = () => {
	const context = useContext(QueryCacheContext)
	if (!context) {
		throw new Error("useQueryCache must be used within an QueryCacheProvider")
	}
	return context
}
