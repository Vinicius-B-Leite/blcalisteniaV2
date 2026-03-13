import { PropsWithChildren } from "react"
import { QueryCacheProvider } from "./reactQuery/ReactQueryProvider"
import { IQueryCache } from "../IQueryCache"
import { ReactQueryService } from "./reactQuery/ReactQueryService"

let QueryCacheServiceProvider: (props: PropsWithChildren) => React.JSX.Element
let QueryCacheService: IQueryCache

QueryCacheServiceProvider = QueryCacheProvider
QueryCacheService = ReactQueryService

export { QueryCacheService, QueryCacheServiceProvider }
