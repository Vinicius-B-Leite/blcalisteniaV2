import { Metrics, SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "@/themes"
import { AuthProvider } from "@/domains/Auth"
import { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react-native"
import {
	ImageStorageProvider,
	ImageStorageService,
	QueryCacheProvider,
	QueryCacheService,
} from "@/infra/services"
import { ReposProviders } from "@/repos/ReposProviders"

export const customRender = (children: ReactElement, options?: RenderOptions) => {
	return render(
		<QueryCacheProvider value={QueryCacheService}>
			<ThemeProvider>
				<SafeAreaProvider
					initialMetrics={
						{
							insets: { bottom: 10, left: 10, right: 10, top: 10 },
						} as Metrics
					}>
					<ReposProviders>
						<ImageStorageProvider value={ImageStorageService}>
							<AuthProvider>{children}</AuthProvider>
						</ImageStorageProvider>
					</ReposProviders>
				</SafeAreaProvider>
			</ThemeProvider>
		</QueryCacheProvider>,
		options,
	)
}
