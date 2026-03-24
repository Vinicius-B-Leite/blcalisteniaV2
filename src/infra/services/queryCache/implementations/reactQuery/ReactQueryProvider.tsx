import {
	QueryClient,
	QueryClientConfig,
	QueryClientProvider,
} from "@tanstack/react-query"
import { PropsWithChildren } from "react"
import { select } from "@/utils"

const config = select.env<QueryClientConfig | undefined>({
	test: {
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: Infinity,
			},
			mutations: {
				retry: false,
				gcTime: Infinity,
			},
		},
	},
	default: undefined,
})

export const queryClient = new QueryClient(config)

export const QueryCacheProvider = ({ children }: PropsWithChildren) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
