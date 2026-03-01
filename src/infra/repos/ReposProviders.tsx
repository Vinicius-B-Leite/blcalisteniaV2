import { AuthRepo } from "./Auth/AuthRepo"
import { AuthRepoProvider } from "./Auth/AuthRepoProvider"

export const ReposProviders = ({ children }: { children: React.ReactNode }) => {
	return <AuthRepoProvider value={AuthRepo}>{children}</AuthRepoProvider>
}
